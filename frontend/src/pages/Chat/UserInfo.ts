import { backendUrl } from "./userContext";

export type User = {
    addUser: null
    avatar: string
    blocklist: []
    dms: []
    email: string
    grade: string
    id: string
    inGame: boolean
    is2FAEnabled: boolean
    roomId: null
    rooms: []
    signup: boolean
    socketId: null
    twoFactorAuthenticationSecret: null
    twofa: boolean
    username: string
    notification: number
    won: number
    lose: number
    point:number
}

class UserInfo {

    private user: User | null = null;
    async connect(): Promise<User | null> {
        if (!this.user) {
            fetch(`http://${backendUrl}/auth-user/user`,
                {
                    credentials: 'include'
                }
            )
                .then(ress => {
                    return ress.json();
                }).then(ress => {
                    // console.log("user auth", ress);
                    this.user = ress;
                })
                .catch(err => {
                    console.log("Error", err);
                });
            // console.log('user connected .............');
        }
        return this.user;
    }

    disconnect(): void {
        this.user = null;
    }

    getuser(): User | null {
        return this.user;
    }
}

const userInfo = new UserInfo();
export default userInfo;
