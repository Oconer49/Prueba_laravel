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
        // Log::info('Obteniendo lista de pedidos');
        $pedidos = Pedido::with(['cliente', 'detalles.producto'])
            ->orderBy('fecha', 'desc')
            ->orderBy('id', 'desc')
            ->get();
        // Log::info('Pedidos obtenidos: ' . $pedidos->count());
        return response()->json($pedidos);
    }

    public function store(StorePedidoRequest $request): JsonResponse
    {
        $validated = $request->validated();
        
        // Log::info('Creando nuevo pedido', $validated);
        // Usar transaccin para asegurar consistencia de datos
        return DB::transaction(function () use ($validated) {
            $productosData = [];
            $total = 0;
            
            // Validar stock y calculr totales
            foreach ($validated['productos'] as $item) {
                // Log::debug('Procesando producto:', $item);
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
            
            // Log::info('Pedido creado con ID: ' . $pedido->id);
            // Crear detalles y descontarr stock
            foreach ($productosData as $item) {
                // Log::debug('Creando detalle para producto: ' . $item['producto']->id);
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
