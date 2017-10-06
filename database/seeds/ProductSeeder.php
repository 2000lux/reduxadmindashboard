<?php

use App\Currency;
use App\Family;
use App\Group;
use App\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('products')->delete();
        DB::table('currencies')->delete();
        DB::table('groups')->delete();
        DB::table('families')->delete();
        
        Currency::create(['name' => '$AR']);
        Currency::create(['name' => 'U$D']);
        
        $families = factory(Family::class, 7)->create();
        $families->each(function($family){
            
            $groups = factory(Group::class, rand(4, 7))->create([
                'family_id' => $family->id
            ]);
            $groups->each(function($group) use($family) {
                            
                $products = factory(Product::class, rand(3, 12))->create([
                    'family_id' => $family->id,
                    'group_id' => $group->id
                ]);          
            });            
        });
        
    }
}
