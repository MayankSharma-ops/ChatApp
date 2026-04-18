(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ApiError",
    ()=>ApiError,
    "api",
    ()=>api
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@swc/helpers/esm/_define_property.js [app-client] (ecmascript)");
;
const BASE = ("TURBOPACK compile-time value", "http://localhost:4000/api") || 'http://localhost:4000/api';
class ApiError extends Error {
    constructor(status, message){
        super(message), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_define_property$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["_"])(this, "status", void 0), this.status = status;
        this.name = 'ApiError';
    }
}
async function request(path) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, token = arguments.length > 2 ? arguments[2] : void 0;
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    if (token) headers['Authorization'] = "Bearer ".concat(token);
    const res = await fetch("".concat(BASE).concat(path), {
        ...options,
        headers
    });
    const data = await res.json().catch(()=>({}));
    if (!res.ok) throw new ApiError(res.status, (data === null || data === void 0 ? void 0 : data.error) || "Error ".concat(res.status));
    return data;
}
const api = {
    get: (path, token)=>request(path, {
            method: 'GET'
        }, token),
    post: (path, body, token)=>request(path, {
            method: 'POST',
            body: JSON.stringify(body)
        }, token),
    put: (path, body, token)=>request(path, {
            method: 'PUT',
            body: JSON.stringify(body)
        }, token)
};
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/context/AuthContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function AuthProvider(param) {
    let { children } = param;
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [token, setToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const stored = localStorage.getItem('chatdapp_token');
            if (!stored) {
                setLoading(false);
                return;
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/auth/me', stored).then({
                "AuthProvider.useEffect": (u)=>{
                    setToken(stored);
                    setUser(u);
                }
            }["AuthProvider.useEffect"]).catch({
                "AuthProvider.useEffect": ()=>{
                    localStorage.removeItem('chatdapp_token');
                    setToken(null);
                }
            }["AuthProvider.useEffect"]).finally({
                "AuthProvider.useEffect": ()=>setLoading(false)
            }["AuthProvider.useEffect"]);
        }
    }["AuthProvider.useEffect"], []);
    const login = async (email, password)=>{
        const data = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post('/auth/login', {
            email,
            password
        });
        localStorage.setItem('chatdapp_token', data.token);
        setToken(data.token);
        setUser(data.user);
        router.push('/');
    };
    const requestRegisterOtp = async (name, email, password)=>{
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post('/auth/register/request-otp', {
            name,
            email,
            password
        });
    };
    const register = async (email, otp)=>{
        const data = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post('/auth/register', {
            email,
            otp
        });
        localStorage.setItem('chatdapp_token', data.token);
        setToken(data.token);
        setUser(data.user);
        router.push('/');
    };
    const logout = ()=>{
        localStorage.removeItem('chatdapp_token');
        setToken(null);
        setUser(null);
        router.push('/login');
    };
    const updateProfile = async (name, avatar_url)=>{
        const updatedUser = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].put('/users/profile', {
            name,
            avatar_url
        }, token);
        setUser(updatedUser);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            token,
            login,
            requestRegisterOtp,
            register,
            updateProfile,
            logout,
            loading
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/AuthContext.tsx",
        lineNumber: 68,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "PbNA1f39UoOYe1R45Fy24SktfoU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AuthProvider;
function useAuth() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!ctx) throw new Error('useAuth must be inside AuthProvider');
    return ctx;
}
_s1(useAuth, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/useSocket.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSocket",
    ()=>useSocket
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/socket.io-client/build/esm/index.js [app-client] (ecmascript) <locals>");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const SOCKET_URL = ("TURBOPACK compile-time truthy", 1) ? ("TURBOPACK compile-time value", "http://localhost:4000/api").replace('/api', '') : "TURBOPACK unreachable";
function useSocket(token) {
    _s();
    const socketRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isConnected, setIsConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useSocket.useEffect": ()=>{
            if (!token) {
                // No token → no connection
                if (socketRef.current) {
                    socketRef.current.disconnect();
                    socketRef.current = null;
                    setIsConnected(false);
                }
                return;
            }
            // Create socket connection with JWT auth
            const socket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["io"])(SOCKET_URL, {
                auth: {
                    token
                },
                transports: [
                    'websocket',
                    'polling'
                ],
                reconnection: true,
                reconnectionAttempts: Infinity,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000
            });
            socket.on('connect', {
                "useSocket.useEffect": ()=>{
                    console.log('🔌 Socket connected');
                    setIsConnected(true);
                }
            }["useSocket.useEffect"]);
            socket.on('disconnect', {
                "useSocket.useEffect": (reason)=>{
                    console.log('🔌 Socket disconnected:', reason);
                    setIsConnected(false);
                }
            }["useSocket.useEffect"]);
            socket.on('connect_error', {
                "useSocket.useEffect": (err)=>{
                    console.error('🔌 Socket connection error:', err.message);
                    setIsConnected(false);
                }
            }["useSocket.useEffect"]);
            socketRef.current = socket;
            return ({
                "useSocket.useEffect": ()=>{
                    socket.disconnect();
                    socketRef.current = null;
                    setIsConnected(false);
                }
            })["useSocket.useEffect"];
        }
    }["useSocket.useEffect"], [
        token
    ]);
    return {
        socket: socketRef.current,
        isConnected
    };
}
_s(useSocket, "CYN7YzET2lyTayvLD2y4n9TqHs0=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/context/ChatContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChatProvider",
    ()=>ChatProvider,
    "useChat",
    ()=>useChat
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$useSocket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/useSocket.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const ChatContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function ChatProvider(param) {
    let { children } = param;
    _s();
    const { token, user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const { socket, isConnected } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$useSocket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocket"])(token);
    const [friends, setFriends] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [friendRequests, setFriendRequests] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [pendingRequests, setPending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [allUsers, setAllUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [activeFriend, setActiveFriend] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [chatLoading, setChatLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [msgLoading, setMsgLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Track the previous active friend so we can leave the old room
    const prevFriendRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const clearError = ()=>setError('');
    // ── Refresh friends / requests (still REST) ──────────────────────
    const refreshAll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatProvider.useCallback[refreshAll]": async ()=>{
            if (!token) return;
            try {
                const [f, fr, p] = await Promise.allSettled([
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/friends', token),
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/friends/requests', token),
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/friends/pending', token)
                ]);
                if (f.status === 'fulfilled') setFriends(f.value);
                if (fr.status === 'fulfilled') setFriendRequests(fr.value);
                if (p.status === 'fulfilled') setPending(p.value);
            } catch (e) {}
        }
    }["ChatProvider.useCallback[refreshAll]"], [
        token
    ]);
    const searchUsers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ChatProvider.useCallback[searchUsers]": async (query)=>{
            if (!token) return;
            const trimmedQuery = query.trim();
            if (!trimmedQuery) {
                setAllUsers([]);
                return;
            }
            try {
                const users = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get("/users?q=".concat(encodeURIComponent(trimmedQuery)), token);
                setAllUsers(users);
                clearError();
            } catch (e) {
                setError(e.message);
            }
        }
    }["ChatProvider.useCallback[searchUsers]"], [
        token
    ]);
    // Initial load of friends data
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatProvider.useEffect": ()=>{
            if (token) refreshAll();
        }
    }["ChatProvider.useEffect"], [
        token,
        refreshAll
    ]);
    // Periodic refresh for friends list (not messages — that's socket now)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatProvider.useEffect": ()=>{
            if (!token) return;
            const id = setInterval(refreshAll, 15000);
            return ({
                "ChatProvider.useEffect": ()=>clearInterval(id)
            })["ChatProvider.useEffect"];
        }
    }["ChatProvider.useEffect"], [
        token,
        refreshAll
    ]);
    // ── Load old messages via REST when opening a chat ───────────────
    const loadMessages = async (friendId)=>{
        if (!token) return;
        try {
            const msgs = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get("/messages/".concat(friendId), token);
            setMessages(msgs);
        } catch (e) {}
    };
    // ── Socket: join / leave chat rooms ──────────────────────────────
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatProvider.useEffect": ()=>{
            if (!socket || !isConnected) return;
            const prev = prevFriendRef.current;
            // Leave previous chat room
            if (prev) {
                socket.emit('leave_chat', prev.friend_id);
            }
            // Join new chat room & load history
            if (activeFriend) {
                socket.emit('join_chat', activeFriend.friend_id);
                loadMessages(activeFriend.friend_id);
                // Mark messages as read
                socket.emit('mark_read', activeFriend.friend_id);
            } else {
                setMessages([]);
            }
            prevFriendRef.current = activeFriend;
        }
    }["ChatProvider.useEffect"], [
        activeFriend,
        socket,
        isConnected
    ]);
    // ── Socket: listen for real-time events ──────────────────────────
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatProvider.useEffect": ()=>{
            if (!socket) return;
            // New message arrives in the active chat
            const handleNewMessage = {
                "ChatProvider.useEffect.handleNewMessage": (msg)=>{
                    setMessages({
                        "ChatProvider.useEffect.handleNewMessage": (prev)=>{
                            // Avoid duplicates (in case of reconnection replays)
                            if (prev.some({
                                "ChatProvider.useEffect.handleNewMessage": (m)=>m.id === msg.id
                            }["ChatProvider.useEffect.handleNewMessage"])) return prev;
                            return [
                                ...prev,
                                msg
                            ];
                        }
                    }["ChatProvider.useEffect.handleNewMessage"]);
                    // If the message is from someone else in the active chat, mark as read
                    if (activeFriend && msg.sender_id === activeFriend.friend_id) {
                        socket.emit('mark_read', activeFriend.friend_id);
                    }
                }
            }["ChatProvider.useEffect.handleNewMessage"];
            // Notification for messages outside the active chat
            const handleNotification = {
                "ChatProvider.useEffect.handleNotification": (data)=>{
                    // You can extend this with toast notifications, badge updates, etc.
                    console.log("📬 Notification from ".concat(data.senderName, ": ").concat(data.preview));
                    // Refresh friends to update any unread indicators
                    refreshAll();
                }
            }["ChatProvider.useEffect.handleNotification"];
            // Someone read our messages
            const handleMessagesRead = {
                "ChatProvider.useEffect.handleMessagesRead": (data)=>{
                    if (activeFriend && data.readBy === activeFriend.friend_id) {
                        setMessages({
                            "ChatProvider.useEffect.handleMessagesRead": (prev)=>prev.map({
                                    "ChatProvider.useEffect.handleMessagesRead": (m)=>m.sender_id === (user === null || user === void 0 ? void 0 : user.id) && !m.is_read ? {
                                            ...m,
                                            is_read: true
                                        } : m
                                }["ChatProvider.useEffect.handleMessagesRead"])
                        }["ChatProvider.useEffect.handleMessagesRead"]);
                    }
                }
            }["ChatProvider.useEffect.handleMessagesRead"];
            socket.on('new_message', handleNewMessage);
            socket.on('notification', handleNotification);
            socket.on('messages_read', handleMessagesRead);
            return ({
                "ChatProvider.useEffect": ()=>{
                    socket.off('new_message', handleNewMessage);
                    socket.off('notification', handleNotification);
                    socket.off('messages_read', handleMessagesRead);
                }
            })["ChatProvider.useEffect"];
        }
    }["ChatProvider.useEffect"], [
        socket,
        activeFriend,
        user === null || user === void 0 ? void 0 : user.id,
        refreshAll
    ]);
    // ── Send message via Socket.IO ───────────────────────────────────
    const sendMessage = async (content)=>{
        if (!socket || !activeFriend || !content.trim()) return;
        setMsgLoading(true);
        try {
            await new Promise((resolve, reject)=>{
                socket.emit('send_message', {
                    receiverId: activeFriend.friend_id,
                    content: content.trim()
                }, (response)=>{
                    if (response === null || response === void 0 ? void 0 : response.error) {
                        reject(new Error(response.error));
                    } else {
                        resolve();
                    }
                });
                // Timeout fallback in case ack never arrives
                setTimeout(()=>reject(new Error('Message send timed out')), 10000);
            });
            clearError();
        } catch (e) {
            setError(e.message);
        } finally{
            setMsgLoading(false);
        }
    };
    // ── Friend requests (still REST) ─────────────────────────────────
    const sendRequest = async (receiverId)=>{
        if (!token) return;
        setChatLoading(true);
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post('/friends/request', {
                receiverId
            }, token);
            await refreshAll();
            clearError();
        } catch (e) {
            setError(e.message);
        } finally{
            setChatLoading(false);
        }
    };
    const respondRequest = async (requesterId, accept)=>{
        if (!token) return;
        setChatLoading(true);
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post('/friends/respond', {
                requesterId,
                accept
            }, token);
            await refreshAll();
            clearError();
        } catch (e) {
            setError(e.message);
        } finally{
            setChatLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ChatContext.Provider, {
        value: {
            friends,
            friendRequests,
            pendingRequests,
            allUsers,
            messages,
            activeFriend,
            setActiveFriend,
            sendMessage,
            searchUsers,
            sendRequest,
            respondRequest,
            loadMessages,
            refreshAll,
            chatLoading,
            msgLoading,
            error,
            clearError
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/ChatContext.tsx",
        lineNumber: 220,
        columnNumber: 5
    }, this);
}
_s(ChatProvider, "123jezJc3MoNsXi22lwSWMpHub8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$useSocket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocket"]
    ];
});
_c = ChatProvider;
function useChat() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ChatContext);
    if (!ctx) throw new Error('useChat must be inside ChatProvider');
    return ctx;
}
_s1(useChat, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "ChatProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/context/CallContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CallProvider",
    ()=>CallProvider,
    "useCall",
    ()=>useCall
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$useSocket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/useSocket.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/AuthContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
const CallContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
// ── ICE Servers (STUN + TURN) ───────────────────────────────────────
const ICE_SERVERS = [
    {
        urls: 'stun:stun.l.google.com:19302'
    },
    {
        urls: 'stun:stun1.l.google.com:19302'
    },
    {
        urls: 'turn:openrelay.metered.ca:80',
        username: 'openrelayproject',
        credential: 'openrelayproject'
    },
    {
        urls: 'turn:openrelay.metered.ca:443',
        username: 'openrelayproject',
        credential: 'openrelayproject'
    },
    {
        urls: 'turn:openrelay.metered.ca:443?transport=tcp',
        username: 'openrelayproject',
        credential: 'openrelayproject'
    }
];
// ── Media constraints ───────────────────────────────────────────────
const AUDIO_CONSTRAINTS = {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true
};
const VIDEO_CONSTRAINTS = {
    width: {
        ideal: 640,
        max: 1280
    },
    height: {
        ideal: 480,
        max: 720
    },
    frameRate: {
        ideal: 24,
        max: 30
    }
};
function CallProvider(param) {
    let { children } = param;
    _s();
    const { token, user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const { socket } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$useSocket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocket"])(token);
    // ── State ─────────────────────────────────────────────────────────
    const [callState, setCallState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('idle');
    const [callType, setCallType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [callId, setCallId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [peerId, setPeerId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [peerName, setPeerName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [peerAvatarColor, setPeerColor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [peerAvatarUrl, setPeerAvatarUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isMuted, setIsMuted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isVideoOff, setIsVideoOff] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isFrontCamera, setIsFrontCamera] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isSpeakerOn, setIsSpeakerOn] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [callDuration, setCallDuration] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [callError, setCallError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [incomingCall, setIncomingCall] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [localStream, setLocalStream] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [remoteStream, setRemoteStream] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // ── Refs ───────────────────────────────────────────────────────────
    const peerConnection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const durationTimer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const ringtoneRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const iceCandidateQueue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    // Keep a ref to callId so event handlers always see the latest
    const callIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(callId);
    const peerIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(peerId);
    callIdRef.current = callId;
    peerIdRef.current = peerId;
    // ── Helpers ───────────────────────────────────────────────────────
    const stopAllTracks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CallProvider.useCallback[stopAllTracks]": (stream)=>{
            stream === null || stream === void 0 ? void 0 : stream.getTracks().forEach({
                "CallProvider.useCallback[stopAllTracks]": (t)=>t.stop()
            }["CallProvider.useCallback[stopAllTracks]"]);
        }
    }["CallProvider.useCallback[stopAllTracks]"], []);
    const stopRingtone = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CallProvider.useCallback[stopRingtone]": ()=>{
            if (ringtoneRef.current) {
                ringtoneRef.current.pause();
                ringtoneRef.current.currentTime = 0;
            }
        }
    }["CallProvider.useCallback[stopRingtone]"], []);
    const resetState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CallProvider.useCallback[resetState]": ()=>{
            setCallState('idle');
            setCallType(null);
            setCallId(null);
            setPeerId(null);
            setPeerName(null);
            setPeerColor(null);
            setPeerAvatarUrl(null);
            setIsMuted(false);
            setIsVideoOff(false);
            setIsFrontCamera(true);
            setIsSpeakerOn(true);
            setCallDuration(0);
            setCallError(null);
            setIncomingCall(null);
            setLocalStream(null);
            setRemoteStream(null);
            iceCandidateQueue.current = [];
            if (durationTimer.current) clearInterval(durationTimer.current);
            durationTimer.current = null;
            stopRingtone();
        }
    }["CallProvider.useCallback[resetState]"], [
        stopRingtone
    ]);
    const cleanup = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CallProvider.useCallback[cleanup]": ()=>{
            if (peerConnection.current) {
                peerConnection.current.onicecandidate = null;
                peerConnection.current.ontrack = null;
                peerConnection.current.oniceconnectionstatechange = null;
                peerConnection.current.close();
                peerConnection.current = null;
            }
            stopAllTracks(localStream);
            resetState();
        }
    }["CallProvider.useCallback[cleanup]"], [
        localStream,
        resetState,
        stopAllTracks
    ]);
    const startDurationTimer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CallProvider.useCallback[startDurationTimer]": ()=>{
            setCallDuration(0);
            durationTimer.current = setInterval({
                "CallProvider.useCallback[startDurationTimer]": ()=>{
                    setCallDuration({
                        "CallProvider.useCallback[startDurationTimer]": (d)=>d + 1
                    }["CallProvider.useCallback[startDurationTimer]"]);
                }
            }["CallProvider.useCallback[startDurationTimer]"], 1000);
        }
    }["CallProvider.useCallback[startDurationTimer]"], []);
    // ── Get user media with fallback ──────────────────────────────────
    const acquireMedia = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CallProvider.useCallback[acquireMedia]": async (type)=>{
            try {
                const constraints = {
                    audio: AUDIO_CONSTRAINTS,
                    video: type === 'video' ? VIDEO_CONSTRAINTS : false
                };
                return await navigator.mediaDevices.getUserMedia(constraints);
            } catch (err) {
                // If video failed, try audio-only fallback
                if (type === 'video' && err.name !== 'NotAllowedError') {
                    console.warn('Video failed, falling back to audio-only');
                    setCallType('audio');
                    return await navigator.mediaDevices.getUserMedia({
                        audio: AUDIO_CONSTRAINTS
                    });
                }
                // Permission denied or no device
                if (err.name === 'NotAllowedError') {
                    throw new Error('Microphone/camera permission denied. Please allow access in your browser settings.');
                }
                if (err.name === 'NotFoundError') {
                    throw new Error('No microphone or camera found on this device.');
                }
                throw new Error('Could not access media devices.');
            }
        }
    }["CallProvider.useCallback[acquireMedia]"], []);
    // ── Create RTCPeerConnection ──────────────────────────────────────
    const createPeer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CallProvider.useCallback[createPeer]": ()=>{
            const pc = new RTCPeerConnection({
                iceServers: ICE_SERVERS
            });
            // Send ICE candidates to the remote peer via signaling
            pc.onicecandidate = ({
                "CallProvider.useCallback[createPeer]": (event)=>{
                    if (event.candidate && socket && peerIdRef.current) {
                        socket.emit('webrtc_ice_candidate', {
                            targetUserId: peerIdRef.current,
                            candidate: event.candidate.toJSON()
                        });
                    }
                }
            })["CallProvider.useCallback[createPeer]"];
            // Receive remote tracks
            pc.ontrack = ({
                "CallProvider.useCallback[createPeer]": (event)=>{
                    const [stream] = event.streams;
                    if (stream) setRemoteStream(stream);
                }
            })["CallProvider.useCallback[createPeer]"];
            // Handle ICE connection state changes (reconnection / failure)
            pc.oniceconnectionstatechange = ({
                "CallProvider.useCallback[createPeer]": ()=>{
                    const state = pc.iceConnectionState;
                    console.log('ICE state:', state);
                    if (state === 'disconnected') {
                        // Attempt ICE restart
                        console.warn('ICE disconnected, attempting restart...');
                        pc.restartIce();
                    }
                    if (state === 'failed') {
                        setCallError('Connection failed. Please try again.');
                        // Give user a moment to see the error, then cleanup
                        setTimeout({
                            "CallProvider.useCallback[createPeer]": ()=>{
                                if (socket && callIdRef.current && peerIdRef.current) {
                                    socket.emit('end_call', {
                                        callId: callIdRef.current,
                                        peerId: peerIdRef.current
                                    });
                                }
                                cleanup();
                            }
                        }["CallProvider.useCallback[createPeer]"], 2000);
                    }
                }
            })["CallProvider.useCallback[createPeer]"];
            peerConnection.current = pc;
            return pc;
        }
    }["CallProvider.useCallback[createPeer]"], [
        socket,
        cleanup
    ]);
    // ══════════════════════════════════════════════════════════════════
    //  PUBLIC ACTIONS
    // ══════════════════════════════════════════════════════════════════
    // ── Call a user ───────────────────────────────────────────────────
    const callUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CallProvider.useCallback[callUser]": async function(friendId, friendName, friendAvatarColor, friendAvatarUrl) {
            let type = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : 'video';
            if (!socket || callState !== 'idle') return;
            setCallError(null);
            setCallType(type);
            setPeerId(friendId);
            peerIdRef.current = friendId;
            setPeerName(friendName);
            setPeerColor(friendAvatarColor);
            setPeerAvatarUrl(friendAvatarUrl !== null && friendAvatarUrl !== void 0 ? friendAvatarUrl : null);
            setCallState('calling');
            try {
                const stream = await acquireMedia(type);
                setLocalStream(stream);
                const pc = createPeer();
                // Add local tracks to the connection
                stream.getTracks().forEach({
                    "CallProvider.useCallback[callUser]": (track)=>pc.addTrack(track, stream)
                }["CallProvider.useCallback[callUser]"]);
                // Create and send offer
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                socket.emit('call_user', {
                    receiverId: friendId,
                    offer: pc.localDescription,
                    callType: type
                });
            } catch (err) {
                setCallError(err.message);
                setCallState('idle');
                cleanup();
            }
        }
    }["CallProvider.useCallback[callUser]"], [
        socket,
        callState,
        acquireMedia,
        createPeer,
        cleanup
    ]);
    // ── Answer incoming call ──────────────────────────────────────────
    const answerCall = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CallProvider.useCallback[answerCall]": async ()=>{
            if (!socket || !incomingCall) return;
            stopRingtone();
            setCallError(null);
            setCallState('connected');
            setCallType(incomingCall.callType);
            setCallId(incomingCall.callId);
            setPeerId(incomingCall.callerId);
            peerIdRef.current = incomingCall.callerId;
            setPeerName(incomingCall.callerName);
            setPeerColor(incomingCall.callerAvatarColor);
            var _incomingCall_callerAvatarUrl;
            setPeerAvatarUrl((_incomingCall_callerAvatarUrl = incomingCall.callerAvatarUrl) !== null && _incomingCall_callerAvatarUrl !== void 0 ? _incomingCall_callerAvatarUrl : null);
            try {
                const stream = await acquireMedia(incomingCall.callType);
                setLocalStream(stream);
                const pc = createPeer();
                stream.getTracks().forEach({
                    "CallProvider.useCallback[answerCall]": (track)=>pc.addTrack(track, stream)
                }["CallProvider.useCallback[answerCall]"]);
                // Set the remote offer
                await pc.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
                // Process queued ICE candidates
                for (const candidate of iceCandidateQueue.current){
                    try {
                        await pc.addIceCandidate(new RTCIceCandidate(candidate));
                    } catch (e) {
                        console.error('Error adding queued ICE candidate', e);
                    }
                }
                iceCandidateQueue.current = [];
                // Create and send answer
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.emit('answer_call', {
                    callId: incomingCall.callId,
                    callerId: incomingCall.callerId,
                    answer: pc.localDescription
                });
                setIncomingCall(null);
                startDurationTimer();
            } catch (err) {
                setCallError(err.message);
                cleanup();
            }
        }
    }["CallProvider.useCallback[answerCall]"], [
        socket,
        incomingCall,
        acquireMedia,
        createPeer,
        cleanup,
        stopRingtone,
        startDurationTimer
    ]);
    // ── Reject incoming call ──────────────────────────────────────────
    const rejectCall = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CallProvider.useCallback[rejectCall]": ()=>{
            if (!socket || !incomingCall) return;
            socket.emit('reject_call', {
                callId: incomingCall.callId,
                callerId: incomingCall.callerId
            });
            stopRingtone();
            setIncomingCall(null);
            resetState();
        }
    }["CallProvider.useCallback[rejectCall]"], [
        socket,
        incomingCall,
        resetState,
        stopRingtone
    ]);
    // ── End active call ───────────────────────────────────────────────
    const endCall = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CallProvider.useCallback[endCall]": ()=>{
            if (socket && callIdRef.current && peerIdRef.current) {
                socket.emit('end_call', {
                    callId: callIdRef.current,
                    peerId: peerIdRef.current
                });
            }
            cleanup();
        }
    }["CallProvider.useCallback[endCall]"], [
        socket,
        cleanup
    ]);
    // ── Toggle mute ───────────────────────────────────────────────────
    const toggleMute = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CallProvider.useCallback[toggleMute]": ()=>{
            if (localStream) {
                localStream.getAudioTracks().forEach({
                    "CallProvider.useCallback[toggleMute]": (t)=>{
                        t.enabled = !t.enabled;
                    }
                }["CallProvider.useCallback[toggleMute]"]);
                setIsMuted({
                    "CallProvider.useCallback[toggleMute]": (m)=>!m
                }["CallProvider.useCallback[toggleMute]"]);
            }
        }
    }["CallProvider.useCallback[toggleMute]"], [
        localStream
    ]);
    // ── Toggle video ──────────────────────────────────────────────────
    const toggleVideo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CallProvider.useCallback[toggleVideo]": ()=>{
            if (localStream) {
                localStream.getVideoTracks().forEach({
                    "CallProvider.useCallback[toggleVideo]": (t)=>{
                        t.enabled = !t.enabled;
                    }
                }["CallProvider.useCallback[toggleVideo]"]);
                setIsVideoOff({
                    "CallProvider.useCallback[toggleVideo]": (v)=>!v
                }["CallProvider.useCallback[toggleVideo]"]);
            }
        }
    }["CallProvider.useCallback[toggleVideo]"], [
        localStream
    ]);
    // ── Flip camera (front ↔ back) ────────────────────────────────────
    const flipCamera = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CallProvider.useCallback[flipCamera]": async ()=>{
            if (!localStream || callType !== 'video') return;
            const newFacing = isFrontCamera ? 'environment' : 'user';
            try {
                let newStream;
                try {
                    newStream = await navigator.mediaDevices.getUserMedia({
                        video: {
                            ...VIDEO_CONSTRAINTS,
                            facingMode: {
                                exact: newFacing
                            }
                        },
                        audio: false
                    });
                } catch (e) {
                    // Fallback for devices without exact facing modes (like desktops)
                    newStream = await navigator.mediaDevices.getUserMedia({
                        video: {
                            ...VIDEO_CONSTRAINTS,
                            facingMode: newFacing
                        },
                        audio: false
                    });
                }
                const newVideoTrack = newStream.getVideoTracks()[0];
                if (!newVideoTrack) return;
                // Replace track in the peer connection
                const pc = peerConnection.current;
                if (pc) {
                    const sender = pc.getSenders().find({
                        "CallProvider.useCallback[flipCamera].sender": (s)=>{
                            var _s_track;
                            return ((_s_track = s.track) === null || _s_track === void 0 ? void 0 : _s_track.kind) === 'video';
                        }
                    }["CallProvider.useCallback[flipCamera].sender"]);
                    if (sender) await sender.replaceTrack(newVideoTrack);
                }
                // Replace track in local stream
                const oldVideoTrack = localStream.getVideoTracks()[0];
                if (oldVideoTrack) {
                    localStream.removeTrack(oldVideoTrack);
                    oldVideoTrack.stop();
                }
                localStream.addTrack(newVideoTrack);
                // Trigger re-render by setting a new stream reference
                setLocalStream(new MediaStream(localStream.getTracks()));
                setIsFrontCamera({
                    "CallProvider.useCallback[flipCamera]": (f)=>!f
                }["CallProvider.useCallback[flipCamera]"]);
            } catch (err) {
                console.warn('Failed to flip camera:', err);
            }
        }
    }["CallProvider.useCallback[flipCamera]"], [
        localStream,
        callType,
        isFrontCamera
    ]);
    // ── Toggle speaker ────────────────────────────────────────────────
    const toggleSpeaker = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CallProvider.useCallback[toggleSpeaker]": ()=>{
            setIsSpeakerOn({
                "CallProvider.useCallback[toggleSpeaker]": (s)=>!s
            }["CallProvider.useCallback[toggleSpeaker]"]);
        // Note: Web Audio API / setSinkId is limited in browsers.
        // On mobile WebViews (e.g., PWA), this can toggle earpiece vs speaker.
        // For desktop browsers, this is primarily a UI toggle.
        }
    }["CallProvider.useCallback[toggleSpeaker]"], []);
    // ══════════════════════════════════════════════════════════════════
    //  SOCKET EVENT LISTENERS
    // ══════════════════════════════════════════════════════════════════
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CallProvider.useEffect": ()=>{
            if (!socket) return;
            // ── Incoming call ─────────────────────────────────────────────
            const handleIncomingCall = {
                "CallProvider.useEffect.handleIncomingCall": (data)=>{
                    // Play ringtone
                    try {
                        ringtoneRef.current = new Audio('/ringtone.mp3');
                        ringtoneRef.current.loop = true;
                        ringtoneRef.current.volume = 0.6;
                        ringtoneRef.current.play().catch({
                            "CallProvider.useEffect.handleIncomingCall": ()=>{}
                        }["CallProvider.useEffect.handleIncomingCall"]);
                    } catch (e) {}
                    setIncomingCall(data);
                    setCallState('ringing');
                }
            }["CallProvider.useEffect.handleIncomingCall"];
            // ── Call ringing (caller side) ────────────────────────────────
            const handleCallRinging = {
                "CallProvider.useEffect.handleCallRinging": (data)=>{
                    setCallId(data.callId);
                }
            }["CallProvider.useEffect.handleCallRinging"];
            // ── Call accepted ─────────────────────────────────────────────
            const handleCallAccepted = {
                "CallProvider.useEffect.handleCallAccepted": async (data)=>{
                    const pc = peerConnection.current;
                    if (!pc) return;
                    try {
                        await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
                        // Process queued ICE candidates
                        for (const candidate of iceCandidateQueue.current){
                            try {
                                await pc.addIceCandidate(new RTCIceCandidate(candidate));
                            } catch (e) {
                                console.error('Error adding queued ICE candidate', e);
                            }
                        }
                        iceCandidateQueue.current = [];
                        setCallState('connected');
                        setCallId(data.callId);
                        startDurationTimer();
                    } catch (err) {
                        console.error('Error setting remote description:', err);
                        setCallError('Failed to establish connection.');
                        cleanup();
                    }
                }
            }["CallProvider.useEffect.handleCallAccepted"];
            // ── Call rejected ─────────────────────────────────────────────
            const handleCallRejected = {
                "CallProvider.useEffect.handleCallRejected": ()=>{
                    setCallError('Call was declined.');
                    setTimeout({
                        "CallProvider.useEffect.handleCallRejected": ()=>cleanup()
                    }["CallProvider.useEffect.handleCallRejected"], 2000);
                }
            }["CallProvider.useEffect.handleCallRejected"];
            // ── User busy ─────────────────────────────────────────────────
            const handleUserBusy = {
                "CallProvider.useEffect.handleUserBusy": ()=>{
                    setCallError('User is busy on another call.');
                    setTimeout({
                        "CallProvider.useEffect.handleUserBusy": ()=>cleanup()
                    }["CallProvider.useEffect.handleUserBusy"], 2000);
                }
            }["CallProvider.useEffect.handleUserBusy"];
            // ── Call timeout ──────────────────────────────────────────────
            const handleCallTimeout = {
                "CallProvider.useEffect.handleCallTimeout": ()=>{
                    stopRingtone();
                    setCallError('No answer.');
                    setTimeout({
                        "CallProvider.useEffect.handleCallTimeout": ()=>cleanup()
                    }["CallProvider.useEffect.handleCallTimeout"], 2000);
                }
            }["CallProvider.useEffect.handleCallTimeout"];
            // ── Call ended (by peer) ──────────────────────────────────────
            const handleCallEnded = {
                "CallProvider.useEffect.handleCallEnded": ()=>{
                    cleanup();
                }
            }["CallProvider.useEffect.handleCallEnded"];
            // ── Call error ────────────────────────────────────────────────
            const handleCallError = {
                "CallProvider.useEffect.handleCallError": (data)=>{
                    setCallError(data.message);
                    setTimeout({
                        "CallProvider.useEffect.handleCallError": ()=>cleanup()
                    }["CallProvider.useEffect.handleCallError"], 2000);
                }
            }["CallProvider.useEffect.handleCallError"];
            // ── ICE candidate from peer ───────────────────────────────────
            const handleIceCandidate = {
                "CallProvider.useEffect.handleIceCandidate": async (data)=>{
                    const pc = peerConnection.current;
                    if (!pc || !pc.remoteDescription) {
                        iceCandidateQueue.current.push(data.candidate);
                        return;
                    }
                    try {
                        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
                    } catch (err) {
                        console.error('Error adding ICE candidate:', err);
                    }
                }
            }["CallProvider.useEffect.handleIceCandidate"];
            socket.on('incoming_call', handleIncomingCall);
            socket.on('call_ringing', handleCallRinging);
            socket.on('call_accepted', handleCallAccepted);
            socket.on('call_rejected', handleCallRejected);
            socket.on('user_busy', handleUserBusy);
            socket.on('call_timeout', handleCallTimeout);
            socket.on('call_ended', handleCallEnded);
            socket.on('call_error', handleCallError);
            socket.on('webrtc_ice_candidate', handleIceCandidate);
            return ({
                "CallProvider.useEffect": ()=>{
                    socket.off('incoming_call', handleIncomingCall);
                    socket.off('call_ringing', handleCallRinging);
                    socket.off('call_accepted', handleCallAccepted);
                    socket.off('call_rejected', handleCallRejected);
                    socket.off('user_busy', handleUserBusy);
                    socket.off('call_timeout', handleCallTimeout);
                    socket.off('call_ended', handleCallEnded);
                    socket.off('call_error', handleCallError);
                    socket.off('webrtc_ice_candidate', handleIceCandidate);
                }
            })["CallProvider.useEffect"];
        }
    }["CallProvider.useEffect"], [
        socket,
        cleanup,
        startDurationTimer,
        stopRingtone
    ]);
    // ── Cleanup on unmount ────────────────────────────────────────────
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CallProvider.useEffect": ()=>{
            return ({
                "CallProvider.useEffect": ()=>{
                    cleanup();
                }
            })["CallProvider.useEffect"];
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["CallProvider.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CallContext.Provider, {
        value: {
            callState,
            callType,
            callId,
            peerId,
            peerName,
            peerAvatarColor,
            peerAvatarUrl,
            isMuted,
            isVideoOff,
            isFrontCamera,
            isSpeakerOn,
            callDuration,
            callError,
            incomingCall,
            localStream,
            remoteStream,
            callUser,
            answerCall,
            rejectCall,
            endCall,
            toggleMute,
            toggleVideo,
            flipCamera,
            toggleSpeaker
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/CallContext.tsx",
        lineNumber: 545,
        columnNumber: 5
    }, this);
}
_s(CallProvider, "z/adZCI/0Vn/r5hYgdXJCJc61mY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$useSocket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSocket"]
    ];
});
_c = CallProvider;
function useCall() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(CallContext);
    if (!ctx) throw new Error('useCall must be inside CallProvider');
    return ctx;
}
_s1(useCall, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "CallProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Call/CallOverlay.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CallOverlay
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CallContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/CallContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone.js [app-client] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PhoneOff$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone-off.js [app-client] (ecmascript) <export default as PhoneOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$video$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Video$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/video.js [app-client] (ecmascript) <export default as Video>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$video$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__VideoOff$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/video-off.js [app-client] (ecmascript) <export default as VideoOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mic$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mic.js [app-client] (ecmascript) <export default as Mic>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MicOff$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mic-off.js [app-client] (ecmascript) <export default as MicOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$switch$2d$camera$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SwitchCamera$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/switch-camera.js [app-client] (ecmascript) <export default as SwitchCamera>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Volume2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/volume-2.js [app-client] (ecmascript) <export default as Volume2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__VolumeX$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/volume-x.js [app-client] (ecmascript) <export default as VolumeX>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/maximize-2.js [app-client] (ecmascript) <export default as Maximize2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minimize$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minimize2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/minimize-2.js [app-client] (ecmascript) <export default as Minimize2>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function formatDuration(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return "".concat(m.toString().padStart(2, '0'), ":").concat(sec.toString().padStart(2, '0'));
}
function CallOverlay() {
    _s();
    const { callState, callType, callError, callDuration, peerName, peerAvatarColor, isMuted, isVideoOff, isFrontCamera, isSpeakerOn, incomingCall, localStream, remoteStream, answerCall, rejectCall, endCall, toggleMute, toggleVideo, flipCamera, toggleSpeaker } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CallContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCall"])();
    const localVideoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const remoteVideoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Fullscreen toggle
    const [isFullscreen, setIsFullscreen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Bind local stream to video element
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CallOverlay.useEffect": ()=>{
            if (localVideoRef.current && localStream) {
                localVideoRef.current.srcObject = localStream;
                localVideoRef.current.play().catch({
                    "CallOverlay.useEffect": (e)=>console.error('Local play err:', e)
                }["CallOverlay.useEffect"]);
            }
        }
    }["CallOverlay.useEffect"], [
        localStream,
        callState,
        isVideoOff
    ]);
    // Bind remote stream to video element
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CallOverlay.useEffect": ()=>{
            if (remoteVideoRef.current && remoteStream) {
                remoteVideoRef.current.srcObject = remoteStream;
                remoteVideoRef.current.play().catch({
                    "CallOverlay.useEffect": (e)=>console.error('Remote play err:', e)
                }["CallOverlay.useEffect"]);
            }
        }
    }["CallOverlay.useEffect"], [
        remoteStream,
        callState
    ]);
    // Fullscreen handler
    const toggleFullscreen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "CallOverlay.useCallback[toggleFullscreen]": async ()=>{
            if (!containerRef.current) return;
            try {
                if (!document.fullscreenElement) {
                    await containerRef.current.requestFullscreen();
                    setIsFullscreen(true);
                } else {
                    await document.exitFullscreen();
                    setIsFullscreen(false);
                }
            } catch (e) {}
        }
    }["CallOverlay.useCallback[toggleFullscreen]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CallOverlay.useEffect": ()=>{
            const handler = {
                "CallOverlay.useEffect.handler": ()=>setIsFullscreen(!!document.fullscreenElement)
            }["CallOverlay.useEffect.handler"];
            document.addEventListener('fullscreenchange', handler);
            return ({
                "CallOverlay.useEffect": ()=>document.removeEventListener('fullscreenchange', handler)
            })["CallOverlay.useEffect"];
        }
    }["CallOverlay.useEffect"], []);
    // ═════════════════════════════════════════════════════════════════
    //  INCOMING CALL NOTIFICATION
    // ═════════════════════════════════════════════════════════════════
    if (callState === 'ringing' && incomingCall) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-surface-card border border-white/10 rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative mx-auto mb-6 w-24 h-24",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 rounded-full animate-ping opacity-20",
                                style: {
                                    backgroundColor: incomingCall.callerAvatarColor
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                lineNumber: 83,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg",
                                style: {
                                    backgroundColor: incomingCall.callerAvatarColor
                                },
                                children: incomingCall.callerName.charAt(0).toUpperCase()
                            }, void 0, false, {
                                fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                lineNumber: 87,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Call/CallOverlay.tsx",
                        lineNumber: 82,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-bold text-white mb-1",
                        children: incomingCall.callerName
                    }, void 0, false, {
                        fileName: "[project]/src/components/Call/CallOverlay.tsx",
                        lineNumber: 95,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-white/50 mb-1",
                        children: [
                            "Incoming ",
                            incomingCall.callType === 'video' ? 'Video' : 'Voice',
                            " Call"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Call/CallOverlay.tsx",
                        lineNumber: 96,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center gap-1 mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce",
                                style: {
                                    animationDelay: '0ms'
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                lineNumber: 102,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce",
                                style: {
                                    animationDelay: '150ms'
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                lineNumber: 103,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce",
                                style: {
                                    animationDelay: '300ms'
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                lineNumber: 104,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Call/CallOverlay.tsx",
                        lineNumber: 101,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: rejectCall,
                                className: "w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg shadow-red-500/30",
                                "aria-label": "Decline call",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PhoneOff$3e$__["PhoneOff"], {
                                    size: 26
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                    lineNumber: 114,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                lineNumber: 109,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: answerCall,
                                className: "w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg shadow-green-500/30",
                                "aria-label": "Accept call",
                                children: incomingCall.callType === 'video' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$video$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Video$3e$__["Video"], {
                                    size: 26
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                    lineNumber: 123,
                                    columnNumber: 19
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                    size: 26
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                    lineNumber: 124,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                lineNumber: 117,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Call/CallOverlay.tsx",
                        lineNumber: 108,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Call/CallOverlay.tsx",
                lineNumber: 80,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/Call/CallOverlay.tsx",
            lineNumber: 79,
            columnNumber: 7
        }, this);
    }
    // ═════════════════════════════════════════════════════════════════
    //  OUTGOING CALL (CALLING / WAITING)
    // ═════════════════════════════════════════════════════════════════
    if (callState === 'calling') {
        var _peerName_charAt_toUpperCase;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative mx-auto mb-6 w-28 h-28",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 rounded-full border-4 animate-ping opacity-30",
                                style: {
                                    borderColor: peerAvatarColor !== null && peerAvatarColor !== void 0 ? peerAvatarColor : '#6366f1'
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                lineNumber: 142,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative w-28 h-28 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-xl",
                                style: {
                                    backgroundColor: peerAvatarColor !== null && peerAvatarColor !== void 0 ? peerAvatarColor : '#6366f1'
                                },
                                children: (_peerName_charAt_toUpperCase = peerName === null || peerName === void 0 ? void 0 : peerName.charAt(0).toUpperCase()) !== null && _peerName_charAt_toUpperCase !== void 0 ? _peerName_charAt_toUpperCase : '?'
                            }, void 0, false, {
                                fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                lineNumber: 146,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Call/CallOverlay.tsx",
                        lineNumber: 141,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold text-white mb-1",
                        children: peerName !== null && peerName !== void 0 ? peerName : 'Calling...'
                    }, void 0, false, {
                        fileName: "[project]/src/components/Call/CallOverlay.tsx",
                        lineNumber: 154,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-white/50 mb-2",
                        children: [
                            callType === 'video' ? 'Video' : 'Voice',
                            " call"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Call/CallOverlay.tsx",
                        lineNumber: 155,
                        columnNumber: 11
                    }, this),
                    callError ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-red-400 text-sm mb-6",
                        children: callError
                    }, void 0, false, {
                        fileName: "[project]/src/components/Call/CallOverlay.tsx",
                        lineNumber: 160,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-white/40 text-sm mb-8 animate-pulse",
                        children: "Ringing…"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Call/CallOverlay.tsx",
                        lineNumber: 162,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: endCall,
                        className: "w-16 h-16 mx-auto rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-all hover:scale-110 shadow-lg shadow-red-500/30",
                        "aria-label": "Cancel call",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PhoneOff$3e$__["PhoneOff"], {
                            size: 26
                        }, void 0, false, {
                            fileName: "[project]/src/components/Call/CallOverlay.tsx",
                            lineNumber: 170,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/Call/CallOverlay.tsx",
                        lineNumber: 165,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Call/CallOverlay.tsx",
                lineNumber: 139,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/Call/CallOverlay.tsx",
            lineNumber: 138,
            columnNumber: 7
        }, this);
    }
    // ═════════════════════════════════════════════════════════════════
    //  ACTIVE CALL (CONNECTED)
    // ═════════════════════════════════════════════════════════════════
    if (callState === 'connected') {
        const isVideo = callType === 'video';
        var _peerName_charAt_toUpperCase1;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            ref: containerRef,
            className: "fixed inset-0 z-[100] bg-black flex flex-col animate-fade-in",
            children: [
                isVideo ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute inset-0 bg-gray-900",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                            ref: remoteVideoRef,
                            autoPlay: true,
                            playsInline: true,
                            className: "w-full h-full object-cover"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Call/CallOverlay.tsx",
                            lineNumber: 192,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute top-4 right-4 w-36 h-28 sm:w-44 sm:h-36 rounded-2xl shadow-2xl border-2 border-white/20 bg-gray-800 z-10 transition-transform duration-700 ease-in-out",
                            style: {
                                transformStyle: 'preserve-3d',
                                transform: isFrontCamera ? 'rotateY(0deg)' : 'rotateY(180deg)'
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full h-full rounded-2xl overflow-hidden",
                                children: !isVideoOff ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                                    ref: localVideoRef,
                                    autoPlay: true,
                                    playsInline: true,
                                    muted: true,
                                    className: "w-full h-full object-cover",
                                    style: {
                                        transform: 'scaleX(-1)'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                    lineNumber: 209,
                                    columnNumber: 19
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-full h-full flex items-center justify-center text-white/40",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$video$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__VideoOff$3e$__["VideoOff"], {
                                        size: 24
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                        lineNumber: 219,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                    lineNumber: 218,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                lineNumber: 207,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/Call/CallOverlay.tsx",
                            lineNumber: 200,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute top-4 left-4 flex items-center gap-3 z-10",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-black/50 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-2 h-2 bg-green-400 rounded-full animate-pulse"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                            lineNumber: 228,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-white/80 text-sm font-medium",
                                            children: peerName
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                            lineNumber: 229,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-white/50 text-sm font-mono",
                                            children: formatDuration(callDuration)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                            lineNumber: 230,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                    lineNumber: 227,
                                    columnNumber: 15
                                }, this),
                                callError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-red-500/20 text-red-300 px-4 py-2 rounded-xl text-sm",
                                    children: callError
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                    lineNumber: 233,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Call/CallOverlay.tsx",
                            lineNumber: 226,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Call/CallOverlay.tsx",
                    lineNumber: 191,
                    columnNumber: 11
                }, this) : /* Audio-only call UI */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("audio", {
                            ref: remoteVideoRef,
                            autoPlay: true
                        }, void 0, false, {
                            fileName: "[project]/src/components/Call/CallOverlay.tsx",
                            lineNumber: 243,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative mb-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute -inset-3 rounded-full opacity-20 animate-pulse",
                                    style: {
                                        backgroundColor: peerAvatarColor !== null && peerAvatarColor !== void 0 ? peerAvatarColor : '#6366f1'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                    lineNumber: 247,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute -inset-6 rounded-full border-2 opacity-10 animate-ping",
                                    style: {
                                        borderColor: peerAvatarColor !== null && peerAvatarColor !== void 0 ? peerAvatarColor : '#6366f1'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                    lineNumber: 251,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative w-32 h-32 rounded-full flex items-center justify-center text-5xl font-bold text-white shadow-2xl",
                                    style: {
                                        backgroundColor: peerAvatarColor !== null && peerAvatarColor !== void 0 ? peerAvatarColor : '#6366f1'
                                    },
                                    children: (_peerName_charAt_toUpperCase1 = peerName === null || peerName === void 0 ? void 0 : peerName.charAt(0).toUpperCase()) !== null && _peerName_charAt_toUpperCase1 !== void 0 ? _peerName_charAt_toUpperCase1 : '?'
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                    lineNumber: 255,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Call/CallOverlay.tsx",
                            lineNumber: 246,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-2xl font-bold text-white mb-1",
                            children: peerName
                        }, void 0, false, {
                            fileName: "[project]/src/components/Call/CallOverlay.tsx",
                            lineNumber: 263,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2 text-white/50 text-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-2 h-2 bg-green-400 rounded-full animate-pulse"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                    lineNumber: 265,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-mono",
                                    children: formatDuration(callDuration)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                    lineNumber: 266,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Call/CallOverlay.tsx",
                            lineNumber: 264,
                            columnNumber: 13
                        }, this),
                        callError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-red-400 text-sm mt-4",
                            children: callError
                        }, void 0, false, {
                            fileName: "[project]/src/components/Call/CallOverlay.tsx",
                            lineNumber: 270,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Call/CallOverlay.tsx",
                    lineNumber: 241,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: isVideo ? 'absolute bottom-0 left-0 right-0 z-20' : '',
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-gray-900/95 backdrop-blur-xl border-t border-white/5 px-4 sm:px-6 py-4 sm:py-5",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-center gap-3 sm:gap-5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ControlButton, {
                                    onClick: toggleMute,
                                    active: isMuted,
                                    activeColor: "red",
                                    label: isMuted ? 'Unmute' : 'Mute',
                                    icon: isMuted ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MicOff$3e$__["MicOff"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                        lineNumber: 287,
                                        columnNumber: 33
                                    }, void 0) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mic$3e$__["Mic"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                        lineNumber: 287,
                                        columnNumber: 56
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                    lineNumber: 282,
                                    columnNumber: 15
                                }, this),
                                isVideo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ControlButton, {
                                    onClick: toggleVideo,
                                    active: isVideoOff,
                                    activeColor: "red",
                                    label: isVideoOff ? 'Camera On' : 'Camera Off',
                                    icon: isVideoOff ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$video$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__VideoOff$3e$__["VideoOff"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                        lineNumber: 297,
                                        columnNumber: 38
                                    }, void 0) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$video$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Video$3e$__["Video"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                        lineNumber: 297,
                                        columnNumber: 63
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                    lineNumber: 292,
                                    columnNumber: 17
                                }, this),
                                isVideo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ControlButton, {
                                    onClick: flipCamera,
                                    active: false,
                                    label: "Flip",
                                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$switch$2d$camera$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__SwitchCamera$3e$__["SwitchCamera"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                        lineNumber: 307,
                                        columnNumber: 25
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                    lineNumber: 303,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ControlButton, {
                                    onClick: toggleSpeaker,
                                    active: !isSpeakerOn,
                                    activeColor: "amber",
                                    label: isSpeakerOn ? 'Speaker' : 'Earpiece',
                                    icon: isSpeakerOn ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Volume2$3e$__["Volume2"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                        lineNumber: 317,
                                        columnNumber: 37
                                    }, void 0) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__VolumeX$3e$__["VolumeX"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                        lineNumber: 317,
                                        columnNumber: 61
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                    lineNumber: 312,
                                    columnNumber: 15
                                }, this),
                                isVideo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ControlButton, {
                                    onClick: toggleFullscreen,
                                    active: false,
                                    label: isFullscreen ? 'Exit Full' : 'Fullscreen',
                                    icon: isFullscreen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minimize$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minimize2$3e$__["Minimize2"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                        lineNumber: 326,
                                        columnNumber: 40
                                    }, void 0) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize2$3e$__["Maximize2"], {
                                        size: 20
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                        lineNumber: 326,
                                        columnNumber: 66
                                    }, void 0),
                                    className: "hidden sm:flex"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                    lineNumber: 322,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: endCall,
                                    className: " w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-all duration-200 hover:scale-110 shadow-lg shadow-red-500/30 ml-2 ",
                                    "aria-label": "End call",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PhoneOff$3e$__["PhoneOff"], {
                                        size: 22
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                        lineNumber: 344,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Call/CallOverlay.tsx",
                                    lineNumber: 332,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Call/CallOverlay.tsx",
                            lineNumber: 279,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/Call/CallOverlay.tsx",
                        lineNumber: 277,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/Call/CallOverlay.tsx",
                    lineNumber: 276,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Call/CallOverlay.tsx",
            lineNumber: 184,
            columnNumber: 7
        }, this);
    }
    // ═════════════════════════════════════════════════════════════════
    //  ENDED STATE (brief flash)
    // ═════════════════════════════════════════════════════════════════
    if (callState === 'ended') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PhoneOff$3e$__["PhoneOff"], {
                        size: 48,
                        className: "text-red-400 mx-auto mb-4"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Call/CallOverlay.tsx",
                        lineNumber: 360,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-white/60 text-lg",
                        children: "Call ended"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Call/CallOverlay.tsx",
                        lineNumber: 361,
                        columnNumber: 11
                    }, this),
                    callError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-red-400 text-sm mt-2",
                        children: callError
                    }, void 0, false, {
                        fileName: "[project]/src/components/Call/CallOverlay.tsx",
                        lineNumber: 362,
                        columnNumber: 25
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Call/CallOverlay.tsx",
                lineNumber: 359,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/Call/CallOverlay.tsx",
            lineNumber: 358,
            columnNumber: 7
        }, this);
    }
    // Idle — render nothing
    return null;
}
_s(CallOverlay, "ZaMyTLCdgoNoQrR3awzYLq8Uaic=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$CallContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCall"]
    ];
});
_c = CallOverlay;
// ═══════════════════════════════════════════════════════════════════
//  Reusable control button component
// ═══════════════════════════════════════════════════════════════════
function ControlButton(param) {
    let { onClick, active, activeColor = 'red', label, icon, className = '' } = param;
    const colorMap = {
        red: {
            bg: 'bg-red-500/20',
            text: 'text-red-400',
            ring: 'ring-red-500/40'
        },
        amber: {
            bg: 'bg-amber-500/20',
            text: 'text-amber-400',
            ring: 'ring-amber-500/40'
        }
    };
    const colors = colorMap[activeColor];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        className: "\n        flex flex-col items-center justify-center gap-1 group\n        ".concat(className, "\n      "),
        "aria-label": label,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "\n          w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center\n          transition-all duration-200 group-hover:scale-110\n          ".concat(active ? "".concat(colors.bg, " ").concat(colors.text, " ring-2 ").concat(colors.ring) : 'bg-white/10 text-white hover:bg-white/20', "\n        "),
                children: icon
            }, void 0, false, {
                fileName: "[project]/src/components/Call/CallOverlay.tsx",
                lineNumber: 415,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "\n        text-[10px] sm:text-xs font-medium\n        ".concat(active ? colors.text : 'text-white/40', "\n      "),
                children: label
            }, void 0, false, {
                fileName: "[project]/src/components/Call/CallOverlay.tsx",
                lineNumber: 427,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Call/CallOverlay.tsx",
        lineNumber: 407,
        columnNumber: 5
    }, this);
}
_c1 = ControlButton;
var _c, _c1;
__turbopack_context__.k.register(_c, "CallOverlay");
__turbopack_context__.k.register(_c1, "ControlButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_08c1816a._.js.map