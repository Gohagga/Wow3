import { MapPlayer, Sound } from "w3ts/index";

export class ErrorService {

    private errorSound: Sound;
    // private color = 'ff6038';
    // private color = 'ff4c38';
    private color = 'f9ce0d';
    constructor() {
        this.errorSound = Sound.fromHandle(CreateSoundFromLabel('InterfaceError', false, false, false, 10, 10));
    }

    DisplayError(player: MapPlayer, message: string) {

        message = `\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n|cff${this.color}${message}|r`;
        if (GetLocalPlayer() == player.handle) {
            ClearTextMessages();
            DisplayTimedTextToPlayer(player.handle, 0.51, 0.96, 2, message);
            this.errorSound.start();
        }

        // set error = "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n|cffffcc00"+error+"|r"
        // if GetLocalPlayer()==whichPlayer then
        //     call ClearTextMessages()
        //     call DisplayTimedTextToPlayer(whichPlayer,0.52,0.96,2,error)
        //     call StartSound(udg_ErrorSound)
        // endif
    }

    TextTagError(message: string, x: number, y: number, z = 100) {
        let tt = CreateTextTag();

        // let dx = 0.086203125 * math.cos(math.pi*0.5);
        // let dy = 0.086203125 * math.sin(ang);

        SetTextTagText(tt, message, TextTagSize2Height(10));
        SetTextTagPos(tt, x, y, z);
        SetTextTagColor(tt, 249, 206, 13, 255);
        SetTextTagVelocity(tt, 0.0, 0.03);
        SetTextTagPermanent(tt, false);
        SetTextTagFadepoint(tt, 0.8);
        SetTextTagLifespan(tt, 1);
    }

    SoundError() {
        this.errorSound.start();
    }
}