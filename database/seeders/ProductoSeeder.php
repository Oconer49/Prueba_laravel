<?php

namespace Database\Seeders;

use App\Models\Producto;
use App\Models\Categoria;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductoSeeder extends Seeder
{
    public function run(): void
    {
        $categorias = Categoria::all();

        $productos = [
            ['nombre' => 'Laptop HP', 'precio' => 899.99, 'stock' => 15, 'categoria_id' => $categorias->where('nombre', 'Electrónica')->first()->id],
            ['nombre' => 'Mouse Logitech', 'precio' => 29.99, 'stock' => 50, 'categoria_id' => $categorias->where('nombre', 'Electrónica')->first()->id],
            ['nombre' => 'Teclado Mecánico', 'precio' => 79.99, 'stock' => 30, 'categoria_id' => $categorias->where('nombre', 'Electrónica')->first()->id],
            ['nombre' => 'Camiseta Nike', 'precio' => 39.99, 'stock' => 100, 'categoria_id' => $categorias->where('nombre', 'Ropa')->first()->id],
            ['nombre' => 'Pantalón Jeans', 'precio' => 59.99, 'stock' => 75, 'categoria_id' => $categorias->where('nombre', 'Ropa')->first()->id],
            ['nombre' => 'Zapatos Deportivos', 'precio' => 89.99, 'stock' => 40, 'categoria_id' => $categorias->where('nombre', 'Ropa')->first()->id],
            ['nombre' => 'Sofá 3 Plazas', 'precio' => 599.99, 'stock' => 10, 'categoria_id' => $categorias->where('nombre', 'Hogar')->first()->id],
            ['nombre' => 'Mesa de Comedor', 'precio' => 299.99, 'stock' => 20, 'categoria_id' => $categorias->where('nombre', 'Hogar')->first()->id],
            ['nombre' => 'Lámpara de Pie', 'precio' => 49.99, 'stock' => 35, 'categoria_id' => $categorias->where('nombre', 'Hogar')->first()->id],
            ['nombre' => 'Pelota de Fútbol', 'precio' => 24.99, 'stock' => 60, 'categoria_id' => $categorias->where('nombre', 'Deportes')->first()->id],
            ['nombre' => 'Raqueta de Tenis', 'precio' => 129.99, 'stock' => 25, 'categoria_id' => $categorias->where('nombre', 'Deportes')->first()->id],
            ['nombre' => 'Bicicleta de Montaña', 'precio' => 399.99, 'stock' => 8, 'categoria_id' => $categorias->where('nombre', 'Deportes')->first()->id],
            ['nombre' => 'El Quijote', 'precio' => 19.99, 'stock' => 45, 'categoria_id' => $categorias->where('nombre', 'Libros')->first()->id],
            ['nombre' => 'Cien Años de Soledad', 'precio' => 22.99, 'stock' => 30, 'categoria_id' => $categorias->where('nombre', 'Libros')->first()->id],
            ['nombre' => '1984', 'precio' => 18.99, 'stock' => 55, 'categoria_id' => $categorias->where('nombre', 'Libros')->first()->id],
        ];

        foreach ($productos as $producto) {
            Producto::create($producto);
        }
    }
}
