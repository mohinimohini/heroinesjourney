
var game = new Phaser.Game(800, 540, Phaser.AUTO, 'phaser-example', {preload: preload, create: create, update: update });



function preload() {

    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar', 'assets/preloader-bar.png');
    this.preloadBar.anchor.setTo(0);
    this.preloadBar.scale.setTo(1);

    this.load.setPreloadSprite(this.preloadBar);

    game.load.image('sky', 'assets/sky6.png');
    game.load.image('ground1', 'assets/platform-b.png');
    game.load.image('ground2', 'assets/platform-s.png');
    game.load.image('ground', 'assets/platform-main2.png');
    game.load.spritesheet('player', 'assets/sprites/spritesheet2.png', 50, 72);
    game.load.spritesheet('pig', 'assets/sprites/piggie2.png', 50, 72);
    game.load.image('bullet', 'assets/bullet.png');

    }

var map;
var layer;
var p;
var cursors;
var platforms;
var player;
var leveltext;
var bullets;
var bulletXSpeed = 600;
var direction = 1;
var spaceBar;
var pigs;

var score = 0;
var scoreText;

function create() {

///////////////////////////// - WORLD - /////////////////////////////////////

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#787878';

    game.world.setBounds(0, 0, 3392, 540);

    game.add.sprite(0, 0, 'sky');


///////////////////////////// - PLATFORMS - /////////////////////////////////////

    platforms = game.add.group();

    platforms.enableBody = true;

    var ground = platforms.create(0, game.world.height - 64, 'ground');

    ground.scale.setTo(1, 1);

    ground.body.immovable = true;

    var ledge = platforms.create(300, 380, 'ground1');
    ledge.body.immovable = true;

    var ledge = platforms.create(600, 290, 'ground1');
    ledge.body.immovable = true;

    var ledge = platforms.create(900, 180, 'ground1');
    ledge.body.immovable = true;

    var ledge = platforms.create(1300, 230, 'ground1');
    ledge.body.immovable = true;

    var ledge = platforms.create(1500, 380, 'ground1');
    ledge.body.immovable = true;

    var ledge = platforms.create(2000, 310, 'ground1');
    ledge.body.immovable = true;

    var ledge = platforms.create(2500, 380, 'ground2');
    ledge.body.immovable = true;

    var ledge = platforms.create(2800, 290, 'ground1');
    ledge.body.immovable = true;

    var ledge = platforms.create(2920, 190, 'ground1');
    ledge.body.immovable = true;

   
///////////////////////////// - PIGS - /////////////////////////////////////

   pigs = game.add.group();
    pigs.enableBody = true;

        var pig2 = pigs.create(475,308,'pig');
            pig2.body.immovable = true;
        var pig2 = pigs.create(795,218,'pig');
            pig2.body.immovable = true;
        var pig2 = pigs.create(1120,108,'pig');
            pig2.body.immovable = true;
        var pig2 = pigs.create(1505,308,'pig');
            pig2.body.immovable = true;
        var pig2 = pigs.create(1545,158,'pig');
            pig2.body.immovable = true;
        var pig2 = pigs.create(2165,238,'pig');
            pig2.body.immovable = true;
        var pig2 = pigs.create(2265,238,'pig');
            pig2.body.immovable = true;
        var pig2 = pigs.create(2975,218,'pig');
            pig2.body.immovable = true;
        var pig2 = pigs.create(3065,218,'pig');
            pig2.body.immovable = true;
        var pig2 = pigs.create(3065,118,'pig');
            pig2.body.immovable = true;

///////////////////////////// - BULLETS - /////////////////////////////////////

    bullets = game.add.group();
    bullets.enableBody=true;
    spaceBar=game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceBar.onDown.add(shootBullet, this);

///////////////////////////// - KEYBOARD INPUT- /////////////////////////////////////

    cursors = game.input.keyboard.createCursorKeys();

///////////////////////////// - PLAYER - /////////////////////////////////////

    player = game.add.sprite(22, game.world.height - 850, 'player');

    game.physics.arcade.enable(player, platforms, pigs);

    player.body.bounce.y = 0.4;
    player.body.gravity.y = 500;
    player.body.collideWorldBounds = true;

    player.animations.add('left', [0, 1,], 10, true);
    player.animations.add('right', [5, 6,], 10, true);

///////////////////////////// - CAMERA - /////////////////////////////////////


    game.camera.follow(player);

///////////////////////////// - SCORE - /////////////////////////////////////

    scoreText = game.add.text(50, 30, '0', { fontSize: '1em', fill: '#35465C', fontFamily: 'Times New Roman'});
    scoreText.fixedToCamera=true;

}

function update() {

    game.physics.arcade.collide(player, platforms);

    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -450;
        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 450;
        player.animations.play('right');
    }
    else
    {
        player.body.velocity.x = 0;
        player.frame = 5;
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }


    game.physics.arcade.collide(pigs, player);
    handlePlayerMovement();

    //if(player.body.position.x>=2810)
    //{
      //  console.log ( '#someButton was clicked' );
    //}
}

function handlePlayerMovement () {
    if (cursors.left.isDown) {
        direction=-1;
    }
    else if (cursors.right.isDown) {
        direction = 1;
    }
}

function shootBullet () {
    if (bullets.length < 15) {
        var bullet = new Bullet (game,player.x+48,player.y+30,direction,bulletXSpeed);
            bullets.add(bullet);
    }
}

Bullet = function (game, x, y, direction, speed) {
    Phaser.Sprite.call(this, game, x, y, "bullet");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.xSpeed = direction * speed;
};

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function () {

    game.physics.arcade.overlap(this, pigs, function (bullet, pig) {
        bullet.destroy();
        pig.destroy();

        score += 100;
        scoreText.text = score;
    });

    game.physics.arcade.overlap(this, platforms, function (bullet) {
        bullet.destroy();
    });

    this.body.velocity.y = 0;
    this.body.velocity.x = this.xSpeed;
    if (this.x < 0 || this.x > 3080) {
        this.destroy();
    }

};

Pig = function (game, x, y, destination) {
    Phaser.Sprite.call(this, game, x, y, "pig");
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.collideWorldBounds = true;
    this.enableBody = true;
    this.animations.add('right', [0, 1, 2, 3], 5, true);
    this.animations.add('left', [4, 5, 6, 7], 5, true);
    this.body.gravity.y = 0;
    this.body.bounce.y = 0;// 0.7 + Math.random() * 0.2;
    this.body.bounce.x = 0;
    this.body.velocity.x = 0;

};

Pig.prototype = Object.create(Phaser.Sprite.prototype);
Pig.prototype.constructor = Pig;

Pig.prototype = Object.create(Phaser.Sprite.prototype);
Pig.prototype.constructor = Pig;

Pig.prototype.update = function () {

    console.log('velo: ' + this.body.touching.down);

    game.physics.arcade.collide(this, platforms, function (pig, platform) {


        if (pig.body.velocity.x > 0) {
            // this.animations.stop();
            pig.animations.play('right');
        } else {
            //this.animations.stop();
            pig.animations.play('left');
        }

    });

    game.physics.arcade.collide(this, pigs, function (pig, pigs) {
        pig.body.velocity.x *= 0;
    });

};




