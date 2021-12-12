gg_rct_BridgeStorm = nil
gg_rct_CorlaTpDest = nil
gg_rct_CorlaTpEnt = nil
gg_trg_Melee_Initialization = nil
gg_unit_H000_0020 = nil
function InitGlobals()
end

function CreateUnitsForPlayer0()
    local p = Player(0)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("Hpal"), -7515.9, -3110.9, 329.084, FourCC("Hpal"))
    gg_unit_H000_0020 = BlzCreateUnitWithSkin(p, FourCC("H000"), -7039.6, -2687.8, 236.103, FourCC("H000"))
    u = BlzCreateUnitWithSkin(p, FourCC("e001"), -9097.2, -2515.1, 191.480, FourCC("e001"))
    u = BlzCreateUnitWithSkin(p, FourCC("e002"), -7219.3, -2709.0, 17.690, FourCC("e002"))
end

function CreateUnitsForPlayer1()
    local p = Player(1)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("e001"), -9094.2, -2533.4, 191.480, FourCC("e001"))
    u = BlzCreateUnitWithSkin(p, FourCC("e002"), -7217.3, -2706.5, 17.690, FourCC("e002"))
end

function CreateUnitsForPlayer2()
    local p = Player(2)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("e001"), -9128.7, -2537.5, 191.480, FourCC("e001"))
    u = BlzCreateUnitWithSkin(p, FourCC("e002"), -7217.2, -2711.5, 17.690, FourCC("e002"))
end

function CreateUnitsForPlayer3()
    local p = Player(3)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("n003"), 2774.4, 3805.4, 268.760, FourCC("n003"))
    u = BlzCreateUnitWithSkin(p, FourCC("n003"), -1362.1, 4397.0, 268.760, FourCC("n003"))
    u = BlzCreateUnitWithSkin(p, FourCC("n003"), 969.8, 3836.6, 268.341, FourCC("n003"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 2307.8, 6468.4, 256.420, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 7937.8, 2860.4, 256.420, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), -2041.8, -2952.3, 256.420, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n003"), -200.1, 5829.2, 268.341, FourCC("n003"))
    u = BlzCreateUnitWithSkin(p, FourCC("n003"), 1082.7, 4081.3, 268.341, FourCC("n003"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 7915.2, 3124.1, 256.420, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n000"), 7509.7, 3059.4, 212.780, FourCC("n000"))
    u = BlzCreateUnitWithSkin(p, FourCC("n003"), -2689.4, -861.4, 268.760, FourCC("n003"))
    u = BlzCreateUnitWithSkin(p, FourCC("h002"), -3510.5, -2975.4, 167.843, FourCC("h002"))
    u = BlzCreateUnitWithSkin(p, FourCC("h002"), -3310.7, -2881.0, 178.390, FourCC("h002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n003"), -2362.9, -839.8, 268.760, FourCC("n003"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), -4389.5, -2666.8, 256.420, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), -4264.3, -2426.3, 256.420, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n000"), -3288.4, -1539.5, 212.780, FourCC("n000"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), -3298.7, -1394.9, 256.420, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("h002"), -2301.9, -3126.9, 167.843, FourCC("h002"))
    u = BlzCreateUnitWithSkin(p, FourCC("h002"), -2088.1, -3134.6, 167.843, FourCC("h002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n000"), -3507.8, -2710.0, 212.780, FourCC("n000"))
    u = BlzCreateUnitWithSkin(p, FourCC("n000"), -5775.9, -3192.5, 212.780, FourCC("n000"))
    u = BlzCreateUnitWithSkin(p, FourCC("h002"), -1690.6, -1652.6, 91.717, FourCC("h002"))
    u = BlzCreateUnitWithSkin(p, FourCC("h002"), -1675.6, -1372.9, 356.869, FourCC("h002"))
    u = BlzCreateUnitWithSkin(p, FourCC("h002"), -1826.4, -1254.1, 322.349, FourCC("h002"))
    u = BlzCreateUnitWithSkin(p, FourCC("h002"), -1930.3, -1618.4, 94.474, FourCC("h002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), -3309.2, -3091.2, 256.420, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), -5223.6, -1996.3, 256.420, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), -5745.5, -3366.8, 256.420, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n000"), -5398.3, -2077.6, 212.780, FourCC("n000"))
    u = BlzCreateUnitWithSkin(p, FourCC("n003"), -2662.7, 1099.9, 268.760, FourCC("n003"))
    u = BlzCreateUnitWithSkin(p, FourCC("n000"), -2516.8, 3220.8, 212.780, FourCC("n000"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), -2686.3, 3318.1, 256.420, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n000"), -1351.9, 4135.5, 212.780, FourCC("n000"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), -1521.4, 4232.8, 256.420, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), -314.1, 5566.6, 256.420, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), -189.0, 5459.8, 256.420, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n000"), -899.7, 5604.4, 212.780, FourCC("n000"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), -1069.3, 5701.7, 256.420, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n000"), 2123.5, 6143.2, 212.780, FourCC("n000"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 1953.9, 6240.5, 256.420, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n000"), 1828.6, 5745.2, 212.780, FourCC("n000"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 1659.1, 5842.5, 256.420, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n000"), 2689.3, 5959.5, 212.780, FourCC("n000"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 2519.8, 6056.8, 256.420, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n000"), 2477.4, 6371.1, 212.780, FourCC("n000"))
    u = BlzCreateUnitWithSkin(p, FourCC("n003"), 3462.7, 3676.2, 268.341, FourCC("n003"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 990.6, -420.9, 256.420, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("h002"), 550.1, -72.5, 94.474, FourCC("h002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 865.4, -661.3, 256.420, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 2763.2, -452.8, 256.420, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("h002"), 2875.8, -559.1, 94.474, FourCC("h002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 2638.0, -693.3, 256.420, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("h002"), 4029.4, -1143.9, 167.843, FourCC("h002"))
    u = BlzCreateUnitWithSkin(p, FourCC("h002"), 4229.1, -1049.5, 178.390, FourCC("h002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n000"), 4032.0, -878.5, 212.780, FourCC("n000"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 4230.6, -1259.7, 256.420, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("h002"), 5612.9, -1661.4, 167.843, FourCC("h002"))
    u = BlzCreateUnitWithSkin(p, FourCC("h002"), 5812.7, -1567.0, 178.390, FourCC("h002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n000"), 5615.6, -1396.0, 212.780, FourCC("n000"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 5814.1, -1777.2, 256.420, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("h002"), 6631.2, -2379.4, 167.843, FourCC("h002"))
    u = BlzCreateUnitWithSkin(p, FourCC("h002"), 6831.0, -2285.1, 178.390, FourCC("h002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n000"), 6633.9, -2114.0, 212.780, FourCC("n000"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 6832.5, -2495.3, 256.420, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("h002"), 8033.5, -1877.3, 167.843, FourCC("h002"))
    u = BlzCreateUnitWithSkin(p, FourCC("h002"), 8233.2, -1782.9, 178.390, FourCC("h002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n000"), 8036.1, -1611.9, 212.780, FourCC("n000"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 8234.7, -1993.1, 256.420, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n000"), 7898.8, 780.2, 212.780, FourCC("n000"))
    u = BlzCreateUnitWithSkin(p, FourCC("h002"), 7782.6, -755.4, 178.390, FourCC("h002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n000"), 7585.5, -584.3, 212.780, FourCC("n000"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 7784.1, -965.6, 256.420, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n003"), 7876.5, -1624.6, 268.341, FourCC("n003"))
    u = BlzCreateUnitWithSkin(p, FourCC("n003"), 5919.7, -501.4, 268.341, FourCC("n003"))
    u = BlzCreateUnitWithSkin(p, FourCC("n003"), 7100.6, 559.0, 268.341, FourCC("n003"))
    u = BlzCreateUnitWithSkin(p, FourCC("h002"), 7896.1, 514.8, 167.843, FourCC("h002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 8097.3, 398.9, 256.420, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 7530.1, -852.0, 256.420, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 8074.8, 662.6, 256.420, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n000"), 7120.2, 1979.7, 212.780, FourCC("n000"))
    u = BlzCreateUnitWithSkin(p, FourCC("h002"), 7117.6, 1714.3, 167.843, FourCC("h002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 7318.8, 1598.4, 256.420, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 7296.3, 1862.1, 256.420, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n000"), 6890.7, 1797.4, 212.780, FourCC("n000"))
    u = BlzCreateUnitWithSkin(p, FourCC("n000"), 6451.2, 3090.5, 212.780, FourCC("n000"))
    u = BlzCreateUnitWithSkin(p, FourCC("h002"), 6448.5, 2825.1, 167.843, FourCC("h002"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 6649.8, 2709.3, 256.420, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n001"), 6627.2, 2972.9, 256.420, FourCC("n001"))
    u = BlzCreateUnitWithSkin(p, FourCC("n000"), 6221.7, 2908.3, 212.780, FourCC("n000"))
    u = BlzCreateUnitWithSkin(p, FourCC("n000"), 7739.2, 3241.7, 212.780, FourCC("n000"))
    u = BlzCreateUnitWithSkin(p, FourCC("h002"), 7736.5, 2976.3, 167.843, FourCC("h002"))
end

function CreateUnitsForPlayer4()
    local p = Player(4)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("e001"), -9138.2, -2511.0, 191.480, FourCC("e001"))
    u = BlzCreateUnitWithSkin(p, FourCC("e002"), -7219.3, -2711.5, 17.690, FourCC("e002"))
end

function CreateUnitsForPlayer6()
    local p = Player(6)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("e001"), -9131.1, -2559.6, 191.480, FourCC("e001"))
    u = BlzCreateUnitWithSkin(p, FourCC("e002"), -7221.4, -2711.5, 17.690, FourCC("e002"))
end

function CreateNeutralHostile()
    local p = Player(PLAYER_NEUTRAL_AGGRESSIVE)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("h003"), -7346.2, -2050.9, 259.134, FourCC("h003"))
    u = BlzCreateUnitWithSkin(p, FourCC("h003"), -6685.7, -2208.8, 282.351, FourCC("h003"))
    u = BlzCreateUnitWithSkin(p, FourCC("h003"), -7085.3, -2002.7, 299.827, FourCC("h003"))
    u = BlzCreateUnitWithSkin(p, FourCC("h003"), -6850.9, -2064.4, 284.713, FourCC("h003"))
end

function CreateNeutralPassiveBuildings()
    local p = Player(PLAYER_NEUTRAL_PASSIVE)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("nwgt"), 1280.0, 6080.0, 270.000, FourCC("nwgt"))
    WaygateSetDestination(u, GetRectCenterX(gg_rct_CorlaTpEnt), GetRectCenterY(gg_rct_CorlaTpEnt))
    WaygateActivate(u, true)
    u = BlzCreateUnitWithSkin(p, FourCC("nwgt"), -640.0, 5696.0, 270.000, FourCC("nwgt"))
    WaygateSetDestination(u, GetRectCenterX(gg_rct_CorlaTpDest), GetRectCenterY(gg_rct_CorlaTpDest))
    WaygateActivate(u, true)
end

function CreateNeutralPassive()
    local p = Player(PLAYER_NEUTRAL_PASSIVE)
    local u
    local unitID
    local t
    local life
    u = BlzCreateUnitWithSkin(p, FourCC("ntav"), -7616.0, -2688.0, 356.449, FourCC("ntav"))
    SetUnitColor(u, ConvertPlayerColor(0))
    u = BlzCreateUnitWithSkin(p, FourCC("o000"), -2606.9, -1942.5, 299.740, FourCC("o000"))
end

function CreatePlayerBuildings()
end

function CreatePlayerUnits()
    CreateUnitsForPlayer0()
    CreateUnitsForPlayer1()
    CreateUnitsForPlayer2()
    CreateUnitsForPlayer3()
    CreateUnitsForPlayer4()
    CreateUnitsForPlayer6()
end

function CreateAllUnits()
    CreateNeutralPassiveBuildings()
    CreatePlayerBuildings()
    CreateNeutralHostile()
    CreateNeutralPassive()
    CreatePlayerUnits()
end

function CreateRegions()
    local we
    gg_rct_BridgeStorm = Rect(-4288.0, -192.0, -608.0, 2336.0)
    we = AddWeatherEffect(gg_rct_BridgeStorm, FourCC("FDrh"))
    EnableWeatherEffect(we, true)
    gg_rct_CorlaTpDest = Rect(1376.0, 5984.0, 1536.0, 6144.0)
    gg_rct_CorlaTpEnt = Rect(-928.0, 5600.0, -736.0, 5792.0)
end

function Trig_Melee_Initialization_Actions()
    MeleeStartingAI()
    SetUnitColor(gg_unit_H000_0020, PLAYER_COLOR_RED)
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
    ForcePlayerStartLocation(Player(0), 0)
    SetPlayerColor(Player(0), ConvertPlayerColor(0))
    SetPlayerRacePreference(Player(0), RACE_PREF_HUMAN)
    SetPlayerRaceSelectable(Player(0), false)
    SetPlayerController(Player(0), MAP_CONTROL_USER)
    SetPlayerStartLocation(Player(1), 1)
    ForcePlayerStartLocation(Player(1), 1)
    SetPlayerColor(Player(1), ConvertPlayerColor(1))
    SetPlayerRacePreference(Player(1), RACE_PREF_ORC)
    SetPlayerRaceSelectable(Player(1), false)
    SetPlayerController(Player(1), MAP_CONTROL_USER)
    SetPlayerStartLocation(Player(2), 2)
    ForcePlayerStartLocation(Player(2), 2)
    SetPlayerColor(Player(2), ConvertPlayerColor(2))
    SetPlayerRacePreference(Player(2), RACE_PREF_UNDEAD)
    SetPlayerRaceSelectable(Player(2), false)
    SetPlayerController(Player(2), MAP_CONTROL_USER)
    SetPlayerStartLocation(Player(3), 3)
    ForcePlayerStartLocation(Player(3), 3)
    SetPlayerColor(Player(3), ConvertPlayerColor(3))
    SetPlayerRacePreference(Player(3), RACE_PREF_ORC)
    SetPlayerRaceSelectable(Player(3), false)
    SetPlayerController(Player(3), MAP_CONTROL_COMPUTER)
    SetPlayerStartLocation(Player(4), 4)
    ForcePlayerStartLocation(Player(4), 4)
    SetPlayerColor(Player(4), ConvertPlayerColor(4))
    SetPlayerRacePreference(Player(4), RACE_PREF_HUMAN)
    SetPlayerRaceSelectable(Player(4), false)
    SetPlayerController(Player(4), MAP_CONTROL_USER)
    SetPlayerStartLocation(Player(6), 5)
    ForcePlayerStartLocation(Player(6), 5)
    SetPlayerColor(Player(6), ConvertPlayerColor(6))
    SetPlayerRacePreference(Player(6), RACE_PREF_UNDEAD)
    SetPlayerRaceSelectable(Player(6), false)
    SetPlayerController(Player(6), MAP_CONTROL_USER)
end

function InitCustomTeams()
    SetPlayerTeam(Player(0), 0)
    SetPlayerState(Player(0), PLAYER_STATE_ALLIED_VICTORY, 1)
    SetPlayerTeam(Player(1), 0)
    SetPlayerState(Player(1), PLAYER_STATE_ALLIED_VICTORY, 1)
    SetPlayerTeam(Player(2), 0)
    SetPlayerState(Player(2), PLAYER_STATE_ALLIED_VICTORY, 1)
    SetPlayerTeam(Player(4), 0)
    SetPlayerState(Player(4), PLAYER_STATE_ALLIED_VICTORY, 1)
    SetPlayerTeam(Player(6), 0)
    SetPlayerState(Player(6), PLAYER_STATE_ALLIED_VICTORY, 1)
    SetPlayerAllianceStateAllyBJ(Player(0), Player(1), true)
    SetPlayerAllianceStateAllyBJ(Player(0), Player(2), true)
    SetPlayerAllianceStateAllyBJ(Player(0), Player(4), true)
    SetPlayerAllianceStateAllyBJ(Player(0), Player(6), true)
    SetPlayerAllianceStateAllyBJ(Player(1), Player(0), true)
    SetPlayerAllianceStateAllyBJ(Player(1), Player(2), true)
    SetPlayerAllianceStateAllyBJ(Player(1), Player(4), true)
    SetPlayerAllianceStateAllyBJ(Player(1), Player(6), true)
    SetPlayerAllianceStateAllyBJ(Player(2), Player(0), true)
    SetPlayerAllianceStateAllyBJ(Player(2), Player(1), true)
    SetPlayerAllianceStateAllyBJ(Player(2), Player(4), true)
    SetPlayerAllianceStateAllyBJ(Player(2), Player(6), true)
    SetPlayerAllianceStateAllyBJ(Player(4), Player(0), true)
    SetPlayerAllianceStateAllyBJ(Player(4), Player(1), true)
    SetPlayerAllianceStateAllyBJ(Player(4), Player(2), true)
    SetPlayerAllianceStateAllyBJ(Player(4), Player(6), true)
    SetPlayerAllianceStateAllyBJ(Player(6), Player(0), true)
    SetPlayerAllianceStateAllyBJ(Player(6), Player(1), true)
    SetPlayerAllianceStateAllyBJ(Player(6), Player(2), true)
    SetPlayerAllianceStateAllyBJ(Player(6), Player(4), true)
    SetPlayerAllianceStateVisionBJ(Player(0), Player(1), true)
    SetPlayerAllianceStateVisionBJ(Player(0), Player(2), true)
    SetPlayerAllianceStateVisionBJ(Player(0), Player(4), true)
    SetPlayerAllianceStateVisionBJ(Player(0), Player(6), true)
    SetPlayerAllianceStateVisionBJ(Player(1), Player(0), true)
    SetPlayerAllianceStateVisionBJ(Player(1), Player(2), true)
    SetPlayerAllianceStateVisionBJ(Player(1), Player(4), true)
    SetPlayerAllianceStateVisionBJ(Player(1), Player(6), true)
    SetPlayerAllianceStateVisionBJ(Player(2), Player(0), true)
    SetPlayerAllianceStateVisionBJ(Player(2), Player(1), true)
    SetPlayerAllianceStateVisionBJ(Player(2), Player(4), true)
    SetPlayerAllianceStateVisionBJ(Player(2), Player(6), true)
    SetPlayerAllianceStateVisionBJ(Player(4), Player(0), true)
    SetPlayerAllianceStateVisionBJ(Player(4), Player(1), true)
    SetPlayerAllianceStateVisionBJ(Player(4), Player(2), true)
    SetPlayerAllianceStateVisionBJ(Player(4), Player(6), true)
    SetPlayerAllianceStateVisionBJ(Player(6), Player(0), true)
    SetPlayerAllianceStateVisionBJ(Player(6), Player(1), true)
    SetPlayerAllianceStateVisionBJ(Player(6), Player(2), true)
    SetPlayerAllianceStateVisionBJ(Player(6), Player(4), true)
    SetPlayerTeam(Player(3), 1)
    SetPlayerState(Player(3), PLAYER_STATE_ALLIED_VICTORY, 1)
end

function InitAllyPriorities()
    SetStartLocPrioCount(0, 4)
    SetStartLocPrio(0, 0, 1, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(0, 1, 2, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(0, 2, 4, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(0, 3, 5, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(1, 4)
    SetStartLocPrio(1, 0, 0, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(1, 1, 2, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(1, 2, 4, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(1, 3, 5, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(2, 4)
    SetStartLocPrio(2, 0, 0, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(2, 1, 1, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(2, 2, 4, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(2, 3, 5, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(3, 6)
    SetStartLocPrio(3, 0, 0, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(3, 1, 1, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(3, 2, 2, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(3, 3, 4, MAP_LOC_PRIO_LOW)
    SetStartLocPrio(3, 4, 5, MAP_LOC_PRIO_LOW)
    SetStartLocPrioCount(4, 4)
    SetStartLocPrio(4, 0, 0, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(4, 1, 1, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(4, 2, 2, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(4, 3, 5, MAP_LOC_PRIO_HIGH)
    SetStartLocPrioCount(5, 4)
    SetStartLocPrio(5, 0, 0, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(5, 1, 1, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(5, 2, 2, MAP_LOC_PRIO_HIGH)
    SetStartLocPrio(5, 3, 4, MAP_LOC_PRIO_HIGH)
end

function main()
    SetCameraBounds(-9472.0 + GetCameraMargin(CAMERA_MARGIN_LEFT), -7680.0 + GetCameraMargin(CAMERA_MARGIN_BOTTOM), 9472.0 - GetCameraMargin(CAMERA_MARGIN_RIGHT), 7168.0 - GetCameraMargin(CAMERA_MARGIN_TOP), -9472.0 + GetCameraMargin(CAMERA_MARGIN_LEFT), 7168.0 - GetCameraMargin(CAMERA_MARGIN_TOP), 9472.0 - GetCameraMargin(CAMERA_MARGIN_RIGHT), -7680.0 + GetCameraMargin(CAMERA_MARGIN_BOTTOM))
    SetDayNightModels("Environment\\DNC\\DNCDungeon\\DNCDungeonTerrain\\DNCDungeonTerrain.mdl", "Environment\\DNC\\DNCDungeon\\DNCDungeonUnit\\DNCDungeonUnit.mdl")
    NewSoundEnvironment("Default")
    SetAmbientDaySound("DungeonDay")
    SetAmbientNightSound("DungeonNight")
    SetMapMusic("Music", true, 0)
    CreateRegions()
    CreateAllUnits()
    InitBlizzard()
    InitGlobals()
    InitCustomTriggers()
    RunInitializationTriggers()
end

function config()
    SetMapName("TRIGSTR_001")
    SetMapDescription("TRIGSTR_003")
    SetPlayers(6)
    SetTeams(6)
    SetGamePlacement(MAP_PLACEMENT_TEAMS_TOGETHER)
    DefineStartLocation(0, -7168.0, -2688.0)
    DefineStartLocation(1, -7168.0, -2688.0)
    DefineStartLocation(2, -7168.0, -2688.0)
    DefineStartLocation(3, 7232.0, 2816.0)
    DefineStartLocation(4, -7168.0, -2688.0)
    DefineStartLocation(5, -7168.0, -2688.0)
    InitCustomPlayerSlots()
    InitCustomTeams()
    InitAllyPriorities()
end

