import { v4 as uuidv4 } from 'uuid';
import database from "./firebase";
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

export class MetaGame {
    constructor() {
        this.myId = uuidv4().substr(0, 16).toUpperCase();
    }

    generateCode() {
        return uuidv4().substr(0, 8).toUpperCase();
    }

    saveGameToFirestore(gameCode) {
        const gameRef = doc(database, 'games', gameCode);
        getDoc(gameRef).then((snapshot) => {
            if (snapshot.exists()) {
                updateDoc(gameRef, {...snapshot.data(), player2: this.myId, active: true});
            } else {
                setDoc(gameRef, {
                    active: false,
                    player1: this.myId,
                    player2: null,
                    board: [[null, null, null], [null, null, null], [null, null, null]]
                });
            }
        });
    }
}