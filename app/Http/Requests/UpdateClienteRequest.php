<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateClienteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $cliente = $this->route('cliente');
        $clienteId = $cliente instanceof \App\Models\Cliente ? $cliente->id : ($cliente ?? $this->route('id'));
        
        return [
            'nombre' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', Rule::unique('clientes', 'email')->ignore($clienteId)],
            'telefono' => ['nullable', 'string', 'max:20'],
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.string' => 'El nombre debe ser texto.',
            'email.email' => 'El email debe tener un formato válido.',
            'email.unique' => 'Este email ya está registrado.',
            'telefono.string' => 'El teléfono debe ser texto.',
        ];
    }
}
