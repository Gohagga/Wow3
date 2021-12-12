import { IDamageEventHandler } from './library/IDamageEventHandler'
import { ActionOrder } from './ActionOrder';
import { DamageEvent } from './DamageEvent';

export interface IWowDamageEventHandler extends IDamageEventHandler<ActionOrder, DamageEvent> {
}