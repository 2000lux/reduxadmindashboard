<?php

use App\Comment;
use App\Contact;
use App\Country;
use App\Currency;
use App\Email;
use App\Enterprise;
use App\Family;
use App\Group;
use App\Interaction;
use App\Product;
use App\QuotationGroup;
use App\Provider;
use App\Province;
use App\Sale;
use App\SaleStatuses;
use App\Sector;
use App\ShipmentType;
use App\Task;
use App\User;
use App\Web;
use Carbon\Carbon;
use Faker\Generator;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| Here you may define all of your model factories. Model factories give
| you a convenient way to create models for testing and seeding your
| database. Just tell the factory how a default model should look.
|
*/

/** @var \Illuminate\Database\Eloquent\Factory $factory */
$factory->define(User::class, function (Generator $faker) {
    static $password;

    return [
        'fullname' => $faker->name,
        'username' => $faker->userName,
        'email' => $faker->unique()->safeEmail,
        'image'=> 'default_image.png',
        'password' => $password ?: $password = bcrypt('secret'),
        'remember_token' => str_random(10),
    ];
});

/** @var \Illuminate\Database\Eloquent\Factory $factory */
$factory->define(Enterprise::class, function (Generator $faker) {

    $province = Province::all()->random();
    
    return [
            'legal_name'=> $faker->company . ' ' . $faker->word,
            'cuit'=> $faker->numerify('30-########-#'),
            'country_id'=> $province->country_id,
            'province_id'=> $province->id,
            'town'=> $faker->city,
            'address'=> $faker->address,
            'zipcode'=> $faker->postcode,
            'phone'=> $faker->phoneNumber,      
            'observations'=> $faker->text,
            'client_type'=> rand(0, 1) ? 'cliente' : 'otros_clientes'
        ];
});

/** @var \Illuminate\Database\Eloquent\Factory $factory */
$factory->define(Web::class, function (Generator $faker) {
    
    return [
        'type' => rand(0, 1) ? 'invoice' : 'bidding',
        'link'=> $faker->url,
        'user'=> $faker->userName,
        'password'=> $faker->password,
        'enterprise_id'=> Enterprise::all()->random()->id,
    ];
});

$factory->define(Sector::class, function (Generator $faker) {

    return [
        'enterprise_id'=> Enterprise::all()->random()->id,
        'name'=> $faker->words(3, true)
    ];
});

$factory->define(Contact::class, function (Generator $faker) {

    return [
            'fullname'=> $faker->firstName . ' ' . $faker->lastName,
            'position'=> $faker->jobTitle,
            'phones'=> $faker->phoneNumber,
            'cellphone'=> $faker->phoneNumber
        ];     
});

$factory->define(Interaction::class, function (Generator $faker, $contact_id = null) {

    return [
            'contact_id' => $contact_id || Contact::all()->random()->id,
            'description'=> $faker->sentence(12),
            'created_at'=> Carbon::now()
        ];
});

$factory->define(Provider::class, function (Generator $faker) {

    return [
            'legal_name'=> $faker->company,
            'cuit'=> $faker->numerify('30-########-#'),
            'country_id'=> Country::all()->random()->id,
            'province_id'=> Province::all()->random()->id,
            'town'=> $faker->city,
            'address'=> $faker->address,
            'zipcode'=> $faker->postcode,
            'phone'=> $faker->phoneNumber,      
            'email'=> $faker->email,      
            'web'=> $faker->url,      
            'observations'=> $faker->text,
        ];
});

$factory->define(Email::class, function (Generator $faker, $contact_id = null) {

    return [
            'contact_id' => $contact_id || Contact::all()->random()->id,
            'email'=> $faker->email
        ];
});

$factory->define(Country::class, function (Generator $faker) {

    return [
            'name'=> $faker->country,
            'code'=> $faker->countryCode,
        ];
});

$factory->define(Province::class, function (Generator $faker) {

    return [
            'name'=> $faker->state,
            'country_id'=> Country::all()->random()->id,
        ];
});

$factory->define(Currency::class, function (Generator $faker) {

    return [
            'name'=> rand(0, 1) ? '$AR' : 'U$D'
        ];
});

$factory->define(Family::class, function (Generator $faker) {

    return [
            'name'=> $faker->word,
        ];
});

$factory->define(Group::class, function (Generator $faker) {

    return [
            'name'=> $faker->word,
            'family_id'=> Family::all()->random()->id
        ];
});

$factory->define(Product::class, function (Generator $faker) {

    return [
            'type'=> $faker->randomElement(['producto', 'repuesto']),
            'code'=> $faker->uuid,
            'name'=> $faker->words(3, true),
            'provider_id'=> Provider::all()->random()->id,
            'family_id'=> Family::all()->random()->id,
            'group_id'=> Group::all()->random()->id,
            'price'=> $faker->randomFloat(2, 200, 9000),
            'currency_id'=> Currency::all()->random()->id
        ];
});

$factory->define(Task::class, function (Generator $faker) {
 
    $status = ['pendiente', 'realizada', 'finalizada'];
    
    $contact = null;
    do {
        $enterprise = Enterprise::all()->random();
        $sectors = Sector::where('enterprise_id', $enterprise->id)->inRandomOrder()->get();
        $sector = $sectors->first();
        if($sector) {
            $contact = $sector->contacts()->first(); 
        }
    } while (!$contact);
    
    $date = Carbon::now();
    
    return [
        'author_id'=> User::all()->random()->id,
        'receiver_id'=> User::all()->random()->id,
        'enterprise_id'=> $enterprise->id,
        'sector_id'=> $sector->id,
        'contact_id'=> $contact->id,
        'priority'=> rand(0, 1) ? 'normal' : 'urgente',
        'status'=> $status[rand(0, 2)],
        'description'=> $faker->text(200),
        'created_at'=> $date->subDays(rand(1, 40))
    ];
});

$factory->define(Comment::class, function (Generator $faker) {

    return [
            'user_id'=> User::all()->random()->id,
            'commentable_id'=> Task::all()->random()->id,
            'commentable_type'=> 'App\Task',
            'content'=> $faker->text(200)
        ];
});

$factory->define(Sale::class, function (Generator $faker) {
 
    $contact_mean = ['email', 'web', 'telefono', 'otro'];
    
    $enterprise = Enterprise::all()->random();
    $contact = $enterprise->contacts()->first(); 
        
    $date = Carbon::now();
    
    return [        
        'sale_status_id'=> SaleStatuses::all()->random()->id,
        'enterprise_id'=> $enterprise->id,
        'contact_id'=> $contact->id,
        'contact_mean'=> $contact_mean[rand(0, 3)],
        'observations'=> $faker->text(200),
        'created_at'=> $date->subDays(rand(1, 40)),
        'currency_id'=> Currency::all()->random()->id,
        'total_price'=> $faker->randomFloat(2, 200, 9000)
    ];
    
});

$factory->define(QuotationGroup::class, function (Generator $faker) {

    return [
            'shipment_type_id'=> ShipmentType::all()->random()->id,
            'fob'=> $faker->randomFloat(2, 200, 9000),
            'volume'=> $faker->numerify('#####'),
            'weight'=> $faker->numerify('#####'),
            'import_expenditure'=> $faker->randomFloat(2, 200, 9000),
            'profitability'=> $faker->randomNumber(2),
            'currency_id'=> Currency::all()->random()->id,
            'sale_price'=> $faker->randomFloat(2, 200, 9000)
        ];
});