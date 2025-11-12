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
        $productos = Producto::with('categoria')
            ->orderBy('nombre')
            ->get();
        return response()->json($productos);
    }

    public function store(StoreProductoRequest $request): JsonResponse
    {
        $producto = Producto::create($request->validated());
        $producto->load('categoria');
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
        $producto->delete();
        return response()->json(['message' => 'Producto eliminado correctamente']);
    }
}
