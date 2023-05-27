
enum TextureKeys {
    DickieMove = 'dickie_move',
    DickieIdle = 'dickie_idle',
    Ice = 'ice',
    Ice2 = 'ice2',
    Bubble = 'bubble',
    Star = 'star',
    LookAt = 'lookat',
    Take = 'take',
    Inventory = 'inventory',
    Fish = 'fish',
    Snow = 'snowflake',
    Mountains = 'mountain_tile',
    Foreground = 'foreground',
    Ground = 'ground',
    Seal = 'seal',
    Tent = 'tent',
    InteractionMenu = 'interaction_menu',
    DialogueChoices = 'dialogue_choices',
    Fog = 'fog',
    Water = 'water',
    Sky = 'sky',
    Middleground = 'middleground',
    UiBox = 'ui_box',
    Logs = 'logs',
}

enum CharacterKey {
    Explorer = 'explorer',

}

enum TilemapKeys {
    Mountains = 'mountains',
}

enum TilesetKeys {
    Mountains = 'mountains',
}

enum SceneKeys {
    Preloader = 'PreloadScene',
    Game = 'GameScene',
    InteractionMenu = 'InteractionMenu',
    Dialogue = 'Dialogue',
    Snowfall = 'Snowfall'
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
}

export {
    TextureKeys, SceneKeys, AnimationKeys, TilemapKeys, TilesetKeys, AudioKeys, CharacterKey, FrameKeys
}