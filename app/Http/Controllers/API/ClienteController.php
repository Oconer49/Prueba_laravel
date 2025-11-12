<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreClienteRequest;
use App\Http\Requests\UpdateClienteRequest;
use App\Models\Cliente;
use Illuminate\Http\JsonResponse;

class ClienteController extends Controller
{
    public function index(): JsonResponse
    {
        // Log::info('Obteniendo lista de clientes');
        $clientes = Cliente::orderBy('nombre')->get();
        // Log::info('Clientes obtenidos: ' . $clientes->count());
        return response()->json($clientes);
    }

    public function store(StoreClienteRequest $request): JsonResponse
    {
        // Log::info('Creando nuevo cliente', $request->validated());
        $cliente = Cliente::create($request->validated());
        // Log::info('Cliente creado con ID: ' . $cliente->id);
        return response()->json($cliente, 201);
    }

    public function show(Cliente $cliente): JsonResponse
    {
        return response()->json($cliente);
    }

    public function update(UpdateClienteRequest $request, Cliente $cliente): JsonResponse
    {
        $cliente->update($request->validated());
        return response()->json($cliente);
    }

    public function destroy(Cliente $cliente): JsonResponse
    {
        // Log::info('Eliminando cliente con ID: ' . $cliente->id);
        $cliente->delete();
        // Log::info('Cliente eliminado correctamente');
        return response()->json(['message' => 'Cliente eliminado correctamente']);
    }
}
