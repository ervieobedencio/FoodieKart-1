<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            ['name' => 'Chicken Adobo', 'description' => 'Classic Filipino braised chicken in soy sauce and vinegar.', 'price' => 120.00, 'is_available' => true],
            ['name' => 'Beef Sinigang', 'description' => 'Sour tamarind-based soup with tender beef and vegetables.', 'price' => 150.00, 'is_available' => true],
            ['name' => 'Pork BBQ (3 sticks)', 'description' => 'Marinated and grilled pork skewers.', 'price' => 90.00, 'is_available' => true],
            ['name' => 'Pancit Canton', 'description' => 'Stir-fried egg noodles with vegetables and pork.', 'price' => 80.00, 'is_available' => true],
            ['name' => 'Lumpiang Shanghai (6)', 'description' => 'Crispy spring rolls filled with seasoned ground pork.', 'price' => 70.00, 'is_available' => true],
            ['name' => 'Fried Rice', 'description' => 'Egg fried rice with garlic and spring onions.', 'price' => 45.00, 'is_available' => true],
            ['name' => 'Halo-Halo', 'description' => 'Classic Filipino shaved ice dessert with assorted sweet mixes.', 'price' => 65.00, 'is_available' => true],
            ['name' => 'Bottled Water', 'description' => '500ml purified drinking water.', 'price' => 20.00, 'is_available' => true],
        ];

        foreach ($products as $product) {
            Product::updateOrCreate(['name' => $product['name']], $product);
        }
    }
}
