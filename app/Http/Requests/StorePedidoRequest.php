<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePedidoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'cliente_id' => ['required', 'exists:clientes,id'],
            'fecha' => ['required', 'date'],
            'productos' => ['required', 'array', 'min:1'],
            'productos.*.producto_id' => ['required', 'exists:productos,id'],
            'productos.*.cantidad' => ['required', 'integer', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'cliente_id.required' => 'Debe seleccionar un cliente.',
            'cliente_id.exists' => 'El cliente seleccionado no existe.',
            'fecha.required' => 'La fecha es obligatoria.',
            'fecha.date' => 'La fecha debe tener un formato válido.',
            'productos.required' => 'Debe agregar al menos un producto al pedido.',
            'productos.array' => 'Los productos deben ser un array.',
            'productos.min' => 'Debe agregar al menos un producto al pedido.',
            'productos.*.producto_id.required' => 'Cada producto debe tener un ID válido.',
            'productos.*.producto_id.exists' => 'Uno de los productos seleccionados no existe.',
            'productos.*.cantidad.required' => 'Cada producto debe tener una cantidad.',
            'productos.*.cantidad.integer' => 'La cantidad debe ser un número entero.',
            'productos.*.cantidad.min' => 'La cantidad debe ser al menos 1.',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->has('productos')) {
                foreach ($this->input('productos') as $index => $producto) {
                    if (isset($producto['producto_id']) && isset($producto['cantidad'])) {
                        $productoModel = \App\Models\Producto::find($producto['producto_id']);
                        if ($productoModel && $productoModel->stock < $producto['cantidad']) {
                            $validator->errors()->add(
                                "productos.{$index}.cantidad",
                                "Stock insuficiente para {$productoModel->nombre}. Stock disponible: {$productoModel->stock}"
                            );
                        }
                    }
                }
            }
        });
    }
}
