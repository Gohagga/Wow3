import { Effect, Timer, Unit } from "w3ts";
import { OrderId } from "w3ts/globals/order";
import { IDamageService } from "../../../services/damage/IDamageService";
import { LastTargetService } from "../../../services/last-target/LastTargetService";
import { AbilityBase } from "../../../systems/abilities/AbilityBase";
import { IAbilityEvent } from "../../../systems/ability-events/event-models/IAbilityEvent";
import { IAbilityEventHandler } from "../../../systems/ability-events/IAbilityEventHandler";
import { AttackType } from "../../../systems/damage/AttackType";
import { DamageType } from "../../../systems/damage/DamageType";
import { HeroStat } from "../../../systems/hero-stats/HeroStat";
import { IHeroStatService } from "../../../systems/hero-stats/IHeroStatService";
import { CastBar } from "../../../systems/progress-bars/CastBar";
import { CastBarService } from "../../../systems/progress-bars/CastBarService";
import { ICastBarService } from "../../../systems/progress-bars/ICastBarService";
import { SpellcastingService } from "../../../systems/progress-bars/SpellcastingService";
import { IUnitConfigurable } from "../../../systems/UnitConfigurable/IUnitConfigurable";
import { UnitConfigurable } from "../../../systems/UnitConfigurable/UnitConfigurable";
import { Scorch, ScorchConfig, ScorchUnitData } from "./Scorch";

export class ScorchFirestarter extends AbilityBase implements IUnitConfigurable<ScorchUnitData> {

    public readonly unitConfig: UnitConfigurable<ScorchUnitData>;

    private readonly removedBuffId: number;
    private readonly nonInterruptOrderId: number[];
    private readonly sfxModelPath: string;

    constructor(
        data: ScorchConfig,
        scorch: Scorch,
        abilityEventHandler: IAbilityEventHandler,
        private readonly damageService: IDamageService,
        private readonly statService: IHeroStatService,
        private readonly castBarService: ICastBarService,
        private readonly lastTargetService: LastTargetService,
        private readonly spellcastingService: SpellcastingService,
    ) {
        super({
            codeId: data.scorchFirestarterCodeId,
            name: data.name,
            orderId: data.orderId,
            tooltip: data.tooltip
        });
        this.unitConfig = scorch.unitConfig;
        this.removedBuffId = FourCC(data.removedBuffCodeId);
        this.nonInterruptOrderId = data.nonInterruptOrderId;
        this.sfxModelPath = data.sfxModel;

        abilityEventHandler.OnAbilityEnd(this.id, e => this.Execute(e));
    }

    Execute(e: IAbilityEvent): void {
        
        print("SCORCH")
        let caster = e.caster;
        caster.removeAbility(this.removedBuffId);

        // Try queueing this spell, if yes stop here
        // if (this.castBarService.TryToQueueAbility(caster, this.orderId, e, e => this.Execute(e))) return;
        if (this.spellcastingService.TryToQueueAbility(caster, this.orderId, e, e => this.Execute(e))) return;

        // print("after q")
        // if (this.castBarService.GetCurrentlyCastingSpell(caster) == this.id) return;
        // print("Cast")

        let data = this.GetUnitConfig(caster);

        let target = this.lastTargetService.Get(caster);
        if (!target) return;

        // const currentOrder = GetIssuedOrderId();
        // if (data.Firestarter == false)
        //     caster.issueImmediateOrder(OrderId.Stop);
        // else if (currentOrder != 0 && currentOrder != OrderId.Move && currentOrder != OrderId.Smart)
        //     caster.issueImmediateOrder(OrderId.Stop);

        if (caster.inRangeOfUnit(target, data.Range)) {

            let victim = target;
            caster.setAnimation('spell channel');
            SetUnitFacing(caster.handle, Atan2(caster.y-target.y, caster.x-target.x));
            let interruptTimer = new Timer();
            this.spellcastingService.CastSpell(caster, this.id, data.CastTime, bar => {
                
                let tim = new Timer();
                tim.start(0.3, false, () => {

                    let int = this.statService.GetStat(caster, HeroStat.Int);
                    this.damageService.UnitDamageTarget(caster, victim, int + data.Damage, AttackType.Spell, DamageType.Fire);
                    new Effect(this.sfxModelPath, victim, 'chest').destroy();
                    tim.destroy();
                });
                interruptTimer.destroy();
                
            }, (orderId: number, castBar: CastBar) => {

                if (orderId == OrderId.Move || orderId == OrderId.Smart)
                    return true;

                if (orderId != data.NonInterruptOrderId)
                    castBar.alive = false;
                    
                if (castBar.isDone)
                    return false;
                    
                return true;
            });
            
            caster.queueAnimation("spell channel");
        }
    }

    GetUnitConfig = (unit: Unit) => this.unitConfig.GetUnitConfig(unit);
    UpdateUnitConfig(unit: Unit, cb: (config: ScorchUnitData) => void): void {
        this.unitConfig.UpdateUnitConfig(unit, cb);
        this.UpdateUnitSkill(unit);
    }

    UpdateUnitSkill(unit: Unit) {
        const data = this.unitConfig.GetUnitConfig(unit);
        const int = this.statService.GetStat(unit, HeroStat.Int);
        const dmg = string.format("%.2f", data.Damage + int);
        
        let tooltip = 
`Inflicts ${dmg} Fire damage to the last targeted enemy.

|cffffd9b3Cooldown ${0}s|r`

        this.UpdateUnitAbilityBase(unit, tooltip);
    }
}