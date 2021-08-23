const WIDTH = 32
const HEIGHT = 17

const SIZE = 8

const FRAME_RATE = 32;

const PLAYER_RADIUS = 3
const PLAYER_COLOR = "green"

const WALL_COLOR = "blue"
const GROUND_COLOR = "black"

const h = 600;

var map_canvas = document.getElementById('map');
var map_ctx = map_canvas.getContext('2d');

var game_canvas = document.getElementById('game');
var game_ctx = game_canvas.getContext('2d');
var g, buffer;

var player;

var map = []
var sprite_map = [];

var sprites = [];
var keyBuffer = null;
var zBuffer = [];

var gun_loaded = false;
var knife_loaded = false;
var wall_loaded = false;
var sprite_loaded = false;
var floor_loaded = false;

var wall_length = 2;
var sprite_length = 2;
var floor_length = 1;

var img_gun;
var img_knife;

var wp_img;
var img_wall = [];
var img_floor = [];
var img_sprite = [];

var others = [];
var others_id = [];

var data_wall = [];
var data_floor = [];
var data_sprite = [];

var keyBuffer2 = [];


var gun_animated = false;