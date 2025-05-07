<?php

namespace App\Services;

use App\Models\Chunk;
use Illuminate\Support\Collection;
use Pgvector\Laravel\Distance;
use Pgvector\Laravel\Vector;

class DistanceQuery
{
    public function cosineDistance(
        array $embedding
    ): Collection
    {

        $query = Chunk::query()
            ->nearestNeighbors('embedding_1536', $embedding, Distance::Cosine)
            ->get();

        $results = collect($query)
            ->unique('id')
            ->take(8);

        return $this->getSiblings($results);
    }

    protected function getSiblings(Collection $results): Collection
    {
        $siblingsIncluded = collect();

        foreach ($results as $result) {
            if ($result->section_number === 0) {
                $siblingsIncluded->push($result);
            } else {
                if ($sibling = $this->getSiblingOrNot($result, $result->section_number - 1)) {

                }
                $siblingsIncluded->push($sibling);

                $siblingsIncluded->push($result);
            }

            if ($sibling = $this->getSiblingOrNot($result, $result->section_number + 1)) {
                $siblingsIncluded->push($sibling);
            }
        }

        return $siblingsIncluded;
    }

    protected function getSiblingOrNot(Chunk $result, int $sectionNumber): false|Chunk
    {
        $sibling = Chunk::query()
            ->where('sort_order', $result->sort_order)
            ->where('section_number', $sectionNumber)
            ->first();

        if ($sibling?->id) {
            return $sibling;
        }

        return false;
    }
}
