// database/migrations/xxxx_create_private_conversations_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('private_conversations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_one_id');
            $table->unsignedBigInteger('user_two_id');
            $table->timestamp('last_message_at')->nullable();
            $table->timestamps();

            $table->foreign('user_one_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('user_two_id')->references('id')->on('users')->onDelete('cascade');

            // Garantir que não haja conversas duplicadas
            $table->unique(['user_one_id', 'user_two_id']);
            $table->index(['user_one_id', 'user_two_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('private_conversations');
    }
};
