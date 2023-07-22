
enum TextureKeys {
    DickieMove = 'dickie_move',
    DickieIdle = 'dickie_idle',
    Ice = 'ice',
    Ice2 = 'ice2',
    LookAt = 'lookat',
    Take = 'take',
    Fish = 'fish',
    Snow = 'snowflake',
    Mountains = 'mountain_tile',
    Foreground = 'foreground',
    Ground = 'ground',
    Seal = 'seal',
    Tent = 'tent',
    TentInside = 'tent_inside',
    TentInsideBed = "tent_inside_bed",
    InteractionMenu = 'interaction_menu',
    DialogueChoices = 'dialogue_choices',
    Fog = 'fog',
    Water = 'water',
    Sky = 'sky',
    Middleground = 'middleground',
    UiBox = 'ui_box',
    Logs = 'logs',
    Bonfire = 'bonfire',
    Skull = 'polarbear_skull',
}

enum CharacterKey {
    Explorer = 'explorer',

}

enum TilemapKeys {
    Mountains = 'mountains',
}

enum SceneKeys {
    Controller = "Controller",
    Preloader = 'PreloadScene',
    Game = 'GameScene',
    InteractionMenu = 'InteractionMenu',
    Dialogue = 'Dialogue',
    Snowfall = 'Snowfall',
    DisplayText = 'DisplayText',
    TentScene = "TentScene",
    Inventory = "Inventory"
}

enum AnimationKeys {
    DickieMoveLeft = 'move_left_',
    DickieMoveRight = 'move_right_',
    DickieIdle = 'idle_',
    ExplorerWind = 'explorer_',
    LogAnimation ='log_quantity_'
}

enum AudioKeys {
    ArcticWinds = 'arctic_winds',
}

enum FrameKeys {
    LogQuant1 = 'log_1',
    LogQuant2 = 'log_2',
    LogQuant3 = 'log_3',
    Bonfire1 = 'bonfire_01',
    Bonfire2 = 'bonfire_02',
}

enum QuestKeys {
    TheBribe = 'theBribe',
    SearchTent = 'searchTent',
}

export {
    TextureKeys, SceneKeys, AnimationKeys, TilemapKeys, AudioKeys, CharacterKey, FrameKeys, QuestKeys
}