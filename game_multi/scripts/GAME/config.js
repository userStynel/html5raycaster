var WIDTH = 32
var HEIGHT = 17

const SIZE = 8
const FRAME_RATE = 32;

const PLAYER_RADIUS = 3
const PLAYER_COLOR = "green"

const WALL_COLOR = "blue"
const GROUND_COLOR = "black"

const h = 600;

var socket = io();

var game_canvas = document.getElementById('game');
var game_ctx = game_canvas.getContext('2d');
var g, buffer;

var player;

var map = []
var sprites = [];

var keyBuffer = 0;
var zBuffer = [];


var wall_loaded = false;
var sprite_loaded = false;
var floor_loaded = false;
var ui_loaded = false;
var character_loaded = false;

var others = [];

const character_src = ['/texture/sprite/character.png'];
const ui_src = ['/texture/ui/gun.png'];

var ui_tile_img = [];
var character_tile_img = [];
var character_tile_imgData = [];

var wall_tile_imgData = [];
var floor_tile_imgData = [];
var sprite_tile_imgData = [];

var game_mode = true;