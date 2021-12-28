gg_trg_Melee_Initialization = nil
gg_unit_E000_0003 = nil
gg_unit_Hblm_0002 = nil
function InitGlobals()
end

function CreateUnitsForPlayer0()
    local p = Player(0)
    local u
    local unitID
    local t
    local life
    gg_unit_Hblm_0002 = BlzCreateUnitWithSkin(p, FourCC("Hblm"), 1.1, -10.7, 0.846, FourCC("Hblm"))
    gg_unit_E000_0003 = BlzCreateUnitWithSkin(p, FourCC("E000"), 166.1, -61.6, 276.575, FourCC("E000"))
end

function CreateNeutralHostile()
    local p = Player(PLAYER_NEUTRAL_AGGRESSIVE)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("h000"), -111.2, 653.1, 247.508, FourCC("h000"))
    u = BlzCreateUnitWithSkin(p, FourCC("h000"), -50.9, 790.1, 270.437, FourCC("h000"))
    u = BlzCreateUnitWithSkin(p, FourCC("h000"), 58.3, 671.5, 102.088, FourCC("h000"))
    u = BlzCreateUnitWithSkin(p, FourCC("h000"), 443.5, 681.1, 237.593, FourCC("h000"))
    u = BlzCreateUnitWithSkin(p, FourCC("h000"), 661.4, 632.9, 276.189, FourCC("h000"))
    u = BlzCreateUnitWithSkin(p, FourCC("h000"), 789.7, 395.9, 207.050, FourCC("h000"))
    u = BlzCreateUnitWithSkin(p, FourCC("h001"), -151.3, -654.9, 329.391, FourCC("h001"))
    life = GetUnitState(u, UNIT_STATE_LIFE)
    SetUnitState(u, UNIT_STATE_LIFE, 0.01 * life)
    u = BlzCreateUnitWithSkin(p, FourCC("h001"), -39.3, -778.6, 351.288, FourCC("h001"))
    life = GetUnitState(u, UNIT_STATE_LIFE)
    SetUnitState(u, UNIT_STATE_LIFE, 0.01 * life)
    u = BlzCreateUnitWithSkin(p, FourCC("h001"), 103.4, -683.4, 258.780, FourCC("h001"))
    life = GetUnitState(u, UNIT_STATE_LIFE)
    SetUnitState(u, UNIT_STATE_LIFE, 0.01 * life)
    u = BlzCreateUnitWithSkin(p, FourCC("h001"), 392.7, -729.1, 209.988, FourCC("h001"))
    life = GetUnitState(u, UNIT_STATE_LIFE)
    SetUnitState(u, UNIT_STATE_LIFE, 0.01 * life)
end

function CreatePlayerBuildings()
end

function CreatePlayerUnits()
    CreateUnitsForPlayer0()
end

function CreateAllUnits()
    CreatePlayerBuildings()
    CreateNeutralHostile()
    CreatePlayerUnits()
end

function Trig_Melee_Initialization_Actions()
    MeleeStartingVisibility()
    MeleeStartingAI()
    SetUnitColor(gg_unit_E000_0003, PLAYER_COLOR_RED)
    SetUnitColor(gg_unit_Hblm_0002, PLAYER_COLOR_RED)
end

function InitTrig_Melee_Initialization()
    gg_trg_Melee_Initialization = CreateTrigger()
    TriggerAddAction(gg_trg_Melee_Initialization, Trig_Melee_Initialization_Actions)
end

function InitCustomTriggers()
    InitTrig_Melee_Initialization()
end

function RunInitializationTriggers()
    ConditionalTriggerExecute(gg_trg_Melee_Initialization)
end

function InitCustomPlayerSlots()
    SetPlayerStartLocation(Player(0), 0)
    SetPlayerColor(Player(0), ConvertPlayerColor(0))
    SetPlayerRacePreference(Player(0), RACE_PREF_HUMAN)
    SetPlayerRaceSelectable(Player(0), true)
    SetPlayerController(Player(0), MAP_CONTROL_USER)
end

function InitCustomTeams()
    SetPlayerTeam(Player(0), 0)
end

function main()
    SetCameraBounds(-3328.0 + GetCameraMargin(CAMERA_MARGIN_LEFT), -3584.0 + GetCameraMargin(CAMERA_MARGIN_BOTTOM), 3328.0 - GetCameraMargin(CAMERA_MARGIN_RIGHT), 3072.0 - GetCameraMargin(CAMERA_MARGIN_TOP), -3328.0 + GetCameraMargin(CAMERA_MARGIN_LEFT), 3072.0 - GetCameraMargin(CAMERA_MARGIN_TOP), 3328.0 - GetCameraMargin(CAMERA_MARGIN_RIGHT), -3584.0 + GetCameraMargin(CAMERA_MARGIN_BOTTOM))
    SetDayNightModels("Environment\\DNC\\DNCLordaeron\\DNCLordaeronTerrain\\DNCLordaeronTerrain.mdl", "Environment\\DNC\\DNCLordaeron\\DNCLordaeronUnit\\DNCLordaeronUnit.mdl")
    NewSoundEnvironment("Default")
    SetAmbientDaySound("LordaeronSummerDay")
    SetAmbientNightSound("LordaeronSummerNight")
    SetMapMusic("Music", true, 0)
    CreateAllUnits()
    InitBlizzard()
    InitGlobals()
    InitCustomTriggers()
    RunInitializationTriggers()
end

function config()
    SetMapName("TRIGSTR_007")
    SetMapDescription("TRIGSTR_009")
    SetPlayers(1)
    SetTeams(1)
    SetGamePlacement(MAP_PLACEMENT_USE_MAP_SETTINGS)
    DefineStartLocation(0, 192.0, -64.0)
    InitCustomPlayerSlots()
    SetPlayerSlotAvailable(Player(0), MAP_CONTROL_USER)
    InitGenericPlayerSlots()
end

