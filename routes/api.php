<?php

use App\Http\Controllers\API\CategoriaController;
use App\Http\Controllers\API\ClienteController;
use App\Http\Controllers\API\InventarioController;
use App\Http\Controllers\API\PedidoController;
use App\Http\Controllers\API\ProductoController;
use Illuminate\Support\Facades\Route;

Route::get('/categorias', [CategoriaController::class, 'index']);
Route::get('/inventario', [InventarioController::class, 'index']);
Route::get('/pedidos', [PedidoController::class, 'index']);
Route::get('/pedidos/{pedido}', [PedidoController::class, 'show']);

Route::apiResource('productos', ProductoController::class);
Route::apiResource('clientes', ClienteController::class);

Route::put('/inventario/{producto}', [InventarioController::class, 'update']);

Route::post('/pedidos', [PedidoController::class, 'store']);
