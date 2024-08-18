import { useClerk } from "@clerk/clerk-react";
import AuthContext from "./AuthContext";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client"

export default function AuthState(props) {

    const { user } = useClerk();
    const socket = useRef();
    const [currentUser, setCurrentUser] = useState();
    const [conversation, setConversation] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([])
    const [arrivalMessage, setArrivalMessage] = useState(null);

    useEffect(() => {
        const handleFunc = async () => {
            await addUserData();
            await fetchAllUsers();
        }
        if (user) {
            handleFunc();
        }
        // eslint-disable-next-line
    }, [user])

    useEffect(() => {
        socket.current = io(`${process.env.REACT_APP_SOCKET_IO}`);
        socket?.current?.on("getMessage", data => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now()
            })
        })

    }, []);

    useEffect(() => {
        if (currentUser?._id) {
            socket.current.emit("addUser", currentUser?._id)
            fetchSideBarConversation();
        }

        socket?.current?.on("getUsers", (users) => {
            setOnlineUsers(users);
            // console.log("Online User: ", users)
        });
        // eslint-disable-next-line
    }, [currentUser]);

    const fetchAllUsers = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL_USER}/data/xyz`);
            let data = await response.json();
            data = data.filter((user) => user._id !== currentUser?._id)
            setAllUsers(data);
        } catch (err) {
            console.log("Alluser Error: ", err.message);
        }
    }

    const addUserData = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL_USER}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: user?.username
                })
            })
            const data = await res.json();
            setCurrentUser(data);
            fetchSideBarConversation();
        } catch (err) {
        }
    };

    const fetchUsers = async (conversation) => {
        try {
            const fetchPromises = conversation.map(async (conv) => {
                const memberId = conv.members[0] === currentUser?._id ? conv.members[1] : conv.members[0];
                const res = await fetch(`${process.env.REACT_APP_BACKEND_URL_USER}/${memberId}`);
                const data = await res.json()

                setUsers((prev) => {
                    if (!prev.some(item => item?._id === data?._id)) {
                        return [...prev, data];
                    }
                    return prev;
                });
            });

            await Promise.all(fetchPromises);
        } catch (err) {
            console.log("User Profile Fetch Error: ", err.message);
        }
    };

    const fetchSideBarConversation = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND}/conversation/${currentUser?._id}`);
            const data = await res.json();
            setConversation(data);
            fetchUsers(data);
        } catch (err) {
            console.log("Side Conversation Error: ", err.message);
        }
    }

    return (
        <AuthContext.Provider value={{ currentUser, socket, arrivalMessage, setArrivalMessage, setOnlineUsers, allUsers, onlineUsers, users, conversation }}>
            {props.children}
        </AuthContext.Provider>
    )
}