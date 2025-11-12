<?php

namespace Database\Seeders;

use App\Models\Cliente;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClienteSeeder extends Seeder
{
    public function run(): void
    {
        $clientes = [
            ['nombre' => 'Juan Pérez', 'email' => 'juan.perez@example.com', 'telefono' => '555-0101'],
            ['nombre' => 'María García', 'email' => 'maria.garcia@example.com', 'telefono' => '555-0102'],
            ['nombre' => 'Carlos López', 'email' => 'carlos.lopez@example.com', 'telefono' => '555-0103'],
            ['nombre' => 'Ana Martínez', 'email' => 'ana.martinez@example.com', 'telefono' => '555-0104'],
            ['nombre' => 'Luis Rodríguez', 'email' => 'luis.rodriguez@example.com', 'telefono' => '555-0105'],
            ['nombre' => 'Laura Sánchez', 'email' => 'laura.sanchez@example.com', 'telefono' => '555-0106'],
            ['nombre' => 'Pedro González', 'email' => 'pedro.gonzalez@example.com', 'telefono' => '555-0107'],
            ['nombre' => 'Carmen Fernández', 'email' => 'carmen.fernandez@example.com', 'telefono' => '555-0108'],
        ];

        foreach ($clientes as $cliente) {
            Cliente::create($cliente);
        }
    }
}
