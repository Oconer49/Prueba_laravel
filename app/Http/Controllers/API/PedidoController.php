<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePedidoRequest;
use App\Models\Pedido;
use App\Models\PedidoDetalle;
use App\Models\Producto;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class PedidoController extends Controller
{
    public function index(): JsonResponse
    {
        $pedidos = Pedido::with(['cliente', 'detalles.producto'])
            ->orderBy('fecha', 'desc')
            ->orderBy('id', 'desc')
            ->get();
        return response()->json($pedidos);
    }

    public function store(StorePedidoRequest $request): JsonResponse
    {
        $validated = $request->validated();
        
        return DB::transaction(function () use ($validated) {
            $productosData = [];
            $total = 0;
            
            foreach ($validated['productos'] as $item) {
                $producto = Producto::findOrFail($item['producto_id']);
                
                if ($producto->stock < $item['cantidad']) {
                    return response()->json([
                        'message' => "Stock insuficiente para {$producto->nombre}. Stock disponible: {$producto->stock}"
                    ], 422);
                }
                
                $precioUnitario = $producto->precio;
                $subtotal = $precioUnitario * $item['cantidad'];
                $total += $subtotal;
                
                $productosData[] = [
                    'producto' => $producto,
                    'cantidad' => $item['cantidad'],
                    'precio_unitario' => $precioUnitario,
                    'subtotal' => $subtotal,
                ];
            }
            
            $pedido = Pedido::create([
                'cliente_id' => $validated['cliente_id'],
                'fecha' => $validated['fecha'],
                'total' => $total,
            ]);
            
            foreach ($productosData as $item) {
                PedidoDetalle::create([
                    'pedido_id' => $pedido->id,
                    'producto_id' => $item['producto']->id,
                    'cantidad' => $item['cantidad'],
                    'precio_unitario' => $item['precio_unitario'],
                    'subtotal' => $item['subtotal'],
                ]);
                
                $item['producto']->decrement('stock', $item['cantidad']);
            }
            
            $pedido->load(['cliente', 'detalles.producto']);
            return response()->json($pedido, 201);
        });
    }

    public function show(Pedido $pedido): JsonResponse
    {
        $pedido->load(['cliente', 'detalles.producto']);
        return response()->json($pedido);
    }
}
