import type { ImageSourcePropType } from 'react-native';

/**
 * Word pictures from Microsoft Fluent Emoji 3D (MIT, assets/words/LICENSE), 256 px PNGs bundled with the app so they
 * work offline and look the same on every device. Keyed by word id; words without one (colours, numbers and three
 * letter examples Fluent has no picture for) keep their drawn SVG in src/art/words. Source name in each comment.
 * People and body parts use Fluent's Light skin tone (light skin, dark hair) instead of the yellow emoji default.
 */
export const WORD_PICTURES: Readonly<Record<string, ImageSourcePropType>> = {
  'animals.dog': require('../../assets/words/animals/dog.png'), // Dog face
  'animals.cat': require('../../assets/words/animals/cat.png'), // Cat face
  'animals.horse': require('../../assets/words/animals/horse.png'), // Horse face
  'animals.cow': require('../../assets/words/animals/cow.png'), // Cow face
  'animals.bird': require('../../assets/words/animals/bird.png'), // Bird
  'animals.fish': require('../../assets/words/animals/fish.png'), // Tropical fish
  'animals.rabbit': require('../../assets/words/animals/rabbit.png'), // Rabbit face
  'animals.bear': require('../../assets/words/animals/bear.png'), // Bear
  'body.head': require('../../assets/words/body/head.png'), // Person
  'body.eye': require('../../assets/words/body/eye.png'), // Eye
  'body.nose': require('../../assets/words/body/nose.png'), // Nose
  'body.mouth': require('../../assets/words/body/mouth.png'), // Mouth
  'body.ear': require('../../assets/words/body/ear.png'), // Ear
  'body.hand': require('../../assets/words/body/hand.png'), // Raised hand
  'body.foot': require('../../assets/words/body/foot.png'), // Foot
  'body.tooth': require('../../assets/words/body/tooth.png'), // Tooth
  'clothes.shirt': require('../../assets/words/clothes/shirt.png'), // T-shirt
  'clothes.pants': require('../../assets/words/clothes/pants.png'), // Jeans
  'clothes.dress': require('../../assets/words/clothes/dress.png'), // Dress
  'clothes.socks': require('../../assets/words/clothes/socks.png'), // Socks
  'clothes.shoes': require('../../assets/words/clothes/shoes.png'), // Running shoe
  'clothes.hat': require('../../assets/words/clothes/hat.png'), // Billed cap
  'clothes.coat': require('../../assets/words/clothes/coat.png'), // Coat
  'clothes.gloves': require('../../assets/words/clothes/gloves.png'), // Gloves
  'family.mom': require('../../assets/words/family/mom.png'), // Woman
  'family.dad': require('../../assets/words/family/dad.png'), // Man
  'family.grandma': require('../../assets/words/family/grandma.png'), // Old woman
  'family.grandpa': require('../../assets/words/family/grandpa.png'), // Old man
  'family.brother': require('../../assets/words/family/brother.png'), // Boy
  'family.sister': require('../../assets/words/family/sister.png'), // Girl
  'family.child': require('../../assets/words/family/child.png'), // Child
  'family.baby': require('../../assets/words/family/baby.png'), // Baby
  'family.friend': require('../../assets/words/family/friend.png'), // People hugging
  'family.uncle': require('../../assets/words/family/uncle.png'), // Man beard
  'family.aunt': require('../../assets/words/family/aunt.png'), // Woman curly hair
  'family.family': require('../../assets/words/family/family.png'), // Man + Woman + Child (scripts/compose-family.mjs)
  'feelings.happy': require('../../assets/words/feelings/happy.png'), // Grinning face
  'feelings.sad': require('../../assets/words/feelings/sad.png'), // Crying face
  'feelings.angry': require('../../assets/words/feelings/angry.png'), // Angry face
  'feelings.scared': require('../../assets/words/feelings/scared.png'), // Fearful face
  'feelings.tired': require('../../assets/words/feelings/tired.png'), // Tired face
  'feelings.surprised': require('../../assets/words/feelings/surprised.png'), // Astonished face
  'feelings.love': require('../../assets/words/feelings/love.png'), // Smiling face with hearts
  'feelings.hungry': require('../../assets/words/feelings/hungry.png'), // Face savoring food
  'food.bread': require('../../assets/words/food/bread.png'), // Bread
  'food.milk': require('../../assets/words/food/milk.png'), // Glass of milk
  'food.apple': require('../../assets/words/food/apple.png'), // Red apple
  'food.egg': require('../../assets/words/food/egg.png'), // Egg
  'food.cheese': require('../../assets/words/food/cheese.png'), // Cheese wedge
  'food.water': require('../../assets/words/food/water.png'), // Droplet
  'food.banana': require('../../assets/words/food/banana.png'), // Banana
  'food.pear': require('../../assets/words/food/pear.png'), // Pear
  'food.apricot': require('../../assets/words/food/apricot.png'), // Peach
  'food.grapes': require('../../assets/words/food/grapes.png'), // Grapes
  'food.carrot': require('../../assets/words/food/carrot.png'), // Carrot
  'food.tomato': require('../../assets/words/food/tomato.png'), // Tomato
  'home.house': require('../../assets/words/home/house.png'), // House
  'home.door': require('../../assets/words/home/door.png'), // Door
  'home.window': require('../../assets/words/home/window.png'), // Window
  'home.bed': require('../../assets/words/home/bed.png'), // Bed
  'home.chair': require('../../assets/words/home/chair.png'), // Chair
  'home.key': require('../../assets/words/home/key.png'), // Key
  'home.lamp': require('../../assets/words/home/lamp.png'), // Light bulb
  'home.clock': require('../../assets/words/home/clock.png'), // Alarm clock
  'nature.sun': require('../../assets/words/nature/sun.png'), // Sun with face
  'nature.moon': require('../../assets/words/nature/moon.png'), // Crescent moon
  'nature.star': require('../../assets/words/nature/star.png'), // Star
  'nature.tree': require('../../assets/words/nature/tree.png'), // Deciduous tree
  'nature.flower': require('../../assets/words/nature/flower.png'), // Tulip
  'nature.rain': require('../../assets/words/nature/rain.png'), // Cloud with rain
  'nature.cloud': require('../../assets/words/nature/cloud.png'), // Cloud
  'nature.mountain': require('../../assets/words/nature/mountain.png'), // Snow-capped mountain
  'toys.ball': require('../../assets/words/toys/ball.png'), // Volleyball
  'toys.doll': require('../../assets/words/toys/doll.png'), // Nesting dolls
  'toys.balloon': require('../../assets/words/toys/balloon.png'), // Balloon
  'toys.drum': require('../../assets/words/toys/drum.png'), // Drum
  'toys.toy': require('../../assets/words/toys/toy.png'), // Teddy bear
  'toys.gift': require('../../assets/words/toys/gift.png'), // Wrapped gift
  'toys.robot': require('../../assets/words/toys/robot.png'), // Robot
  'toys.book': require('../../assets/words/toys/book.png'), // Green book
  'school.school': require('../../assets/words/school/school.png'), // School
  'school.teacher': require('../../assets/words/school/teacher.png'), // Teacher (Light)
  'school.backpack': require('../../assets/words/school/backpack.png'), // Backpack
  'school.pencil': require('../../assets/words/school/pencil.png'), // Pencil
  'school.notebook': require('../../assets/words/school/notebook.png'), // Notebook
  'school.scissors': require('../../assets/words/school/scissors.png'), // Scissors
  'school.ruler': require('../../assets/words/school/ruler.png'), // Straight ruler
  'school.crayon': require('../../assets/words/school/crayon.png'), // Crayon
  'weather.rainbow': require('../../assets/words/weather/rainbow.png'), // Rainbow
  'weather.snow': require('../../assets/words/weather/snow.png'), // Snowflake
  'weather.wind': require('../../assets/words/weather/wind.png'), // Wind face
  'weather.umbrella': require('../../assets/words/weather/umbrella.png'), // Umbrella with rain drops
  'weather.spring': require('../../assets/words/weather/spring.png'), // Cherry blossom
  'weather.summer': require('../../assets/words/weather/summer.png'), // Beach with umbrella
  'weather.autumn': require('../../assets/words/weather/autumn.png'), // Fallen leaf
  'weather.winter': require('../../assets/words/weather/winter.png'), // Snowman
  'kitchen.plate': require('../../assets/words/kitchen/plate.png'), // Fork and knife with plate
  'kitchen.spoon': require('../../assets/words/kitchen/spoon.png'), // Spoon
  'kitchen.bowl': require('../../assets/words/kitchen/bowl.png'), // Bowl with spoon
  'kitchen.cup': require('../../assets/words/kitchen/cup.png'), // Hot beverage
  'kitchen.pot': require('../../assets/words/kitchen/pot.png'), // Pot of food
  'kitchen.pan': require('../../assets/words/kitchen/pan.png'), // Cooking
  'kitchen.teapot': require('../../assets/words/kitchen/teapot.png'), // Teapot
  'kitchen.salt': require('../../assets/words/kitchen/salt.png'), // Salt
  'playground.slide': require('../../assets/words/playground/slide.png'), // Playground slide
  'playground.kite': require('../../assets/words/playground/kite.png'), // Kite
  'playground.bucket': require('../../assets/words/playground/bucket.png'), // Bucket
  'playground.carousel': require('../../assets/words/playground/carousel.png'), // Carousel horse
  'playground.bubbles': require('../../assets/words/playground/bubbles.png'), // Bubbles
  'playground.icecream': require('../../assets/words/playground/icecream.png'), // Soft ice cream
  'playground.fountain': require('../../assets/words/playground/fountain.png'), // Fountain
  'playground.scooter': require('../../assets/words/playground/scooter.png'), // Kick scooter
  'holidays.newyeartree': require('../../assets/words/holidays/newyeartree.png'), // Christmas tree
  'holidays.santa': require('../../assets/words/holidays/santa.png'), // Santa Claus (Light)
  'holidays.gata': require('../../assets/words/holidays/gata.png'), // Pie
  'holidays.fireworks': require('../../assets/words/holidays/fireworks.png'), // Fireworks
  'holidays.cake': require('../../assets/words/holidays/cake.png'), // Birthday cake
  'holidays.candle': require('../../assets/words/holidays/candle.png'), // Candle
  'holidays.vardavar': require('../../assets/words/holidays/vardavar.png'), // Water pistol
  'holidays.dove': require('../../assets/words/holidays/dove.png'), // Dove
  'actions.eat': require('../../assets/words/actions/eat.png'), // Spaghetti
  'actions.sleep': require('../../assets/words/actions/sleep.png'), // Sleeping face
  'actions.run': require('../../assets/words/actions/run.png'), // Person running (Light)
  'actions.play': require('../../assets/words/actions/play.png'), // Yo-yo
  'actions.swim': require('../../assets/words/actions/swim.png'), // Person swimming (Light)
  'actions.dance': require('../../assets/words/actions/dance.png'), // Woman dancing (Light)
  'actions.sing': require('../../assets/words/actions/sing.png'), // Singer (Light)
  'actions.draw': require('../../assets/words/actions/draw.png'), // Artist palette
  'phrases.hello': require('../../assets/words/phrases/hello.png'), // Person raising hand (Light)
  'phrases.goodmorning': require('../../assets/words/phrases/goodmorning.png'), // Sunrise
  'phrases.goodnight': require('../../assets/words/phrases/goodnight.png'), // Night with stars
  'phrases.thankyou': require('../../assets/words/phrases/thankyou.png'), // Folded hands (Light)
  'phrases.please': require('../../assets/words/phrases/please.png'), // Pleading face
  'phrases.iloveyou': require('../../assets/words/phrases/iloveyou.png'), // Heart with ribbon
  'phrases.howareyou': require('../../assets/words/phrases/howareyou.png'), // Slightly smiling face
  'phrases.goodbye': require('../../assets/words/phrases/goodbye.png'), // Waving hand (Light)
  'transport.car': require('../../assets/words/transport/car.png'), // Automobile
  'transport.bus': require('../../assets/words/transport/bus.png'), // Bus
  'transport.train': require('../../assets/words/transport/train.png'), // Locomotive
  'transport.plane': require('../../assets/words/transport/plane.png'), // Airplane
  'transport.boat': require('../../assets/words/transport/boat.png'), // Sailboat
  'transport.bike': require('../../assets/words/transport/bike.png'), // Bicycle
  'transport.truck': require('../../assets/words/transport/truck.png'), // Delivery truck
  'transport.helicopter': require('../../assets/words/transport/helicopter.png'), // Helicopter
  'letters.duck': require('../../assets/words/letters/duck.png'), // Duck
  'letters.deer': require('../../assets/words/letters/deer.png'), // Deer
  'letters.bell': require('../../assets/words/letters/bell.png'), // Bell
  'letters.page': require('../../assets/words/letters/page.png'), // Page facing up
  'letters.chick': require('../../assets/words/letters/chick.png'), // Baby chick
  'letters.orange': require('../../assets/words/letters/orange.png'), // Tangerine
  'letters.sheep': require('../../assets/words/letters/sheep.png'), // Ewe
  'letters.radio': require('../../assets/words/letters/radio.png'), // Radio
  'letters.heart': require('../../assets/words/letters/heart.png'), // Red heart
  'letters.rose': require('../../assets/words/letters/rose.png'), // Rose
  'letters.minute': require('../../assets/words/letters/minute.png'), // Stopwatch
  'letters.baby_goat': require('../../assets/words/letters/baby_goat.png'), // Goat
  'letters.elephant': require('../../assets/words/letters/elephant.png'), // Elephant
  'letters.snake': require('../../assets/words/letters/snake.png'), // Snake
  'letters.football': require('../../assets/words/letters/football.png'), // Soccer ball
};
