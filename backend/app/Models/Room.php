<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'is_private',
        'created_by',
    ];

    protected $casts = [
        'is_private' => 'boolean',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->withPivot('joined_at')
            ->withTimestamps();
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public function latestMessages(): HasMany
    {
        return $this->hasMany(Message::class)
            ->with('user')
            ->latest()
            ->limit(50);
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function userCanAccess(int $userId): bool
    {
        if (! $this->is_private) return true;
        if ((int) $this->created_by === $userId) return true;
        return $this->users()->where('user_id', $userId)->exists();
    }
}
