<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductoRequest;
use App\Http\Requests\UpdateProductoRequest;
use App\Models\Producto;
use Illuminate\Http\JsonResponse;

class ProductoController extends Controller
{
    public function index(): JsonResponse
    {
        // Log::info('Obteniendo lista de productos');
        $productos = Producto::with('categoria')
            ->orderBy('nombre')
            ->get();
        // Log::info('Productos obtenidos: ' . $productos->count());
        return response()->json($productos);
    }

    public function store(StoreProductoRequest $request): JsonResponse
    {
        // Log::info('Creando nuevo producto', $request->validated());
        $producto = Producto::create($request->validated());
        $producto->load('categoria');
        // Log::info('Producto creado con ID: ' . $producto->id);
        return response()->json($producto, 201);
    }

    public function show(Producto $producto): JsonResponse
    {
        $producto->load('categoria');
        return response()->json($producto);
    }

    public function update(UpdateProductoRequest $request, Producto $producto): JsonResponse
    {
        $producto->update($request->validated());
        $producto->load('categoria');
        return response()->json($producto);
    }

    public function destroy(Producto $producto): JsonResponse
    {
        // Log::info('Eliminando producto con ID: ' . $producto->id);
        $producto->delete();
        // Log::info('Producto eliminado correctamente');
        return response()->json(['message' => 'Producto eliminado correctamente']);
    }
}
