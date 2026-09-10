package com.example.inventory_dashboard.service;

import com.example.inventory_dashboard.model.Movement;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.json.JsonMapper;

import java.io.IOException;
import java.io.InputStream;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;

@Service
public class MovementService {

    private final JsonMapper objectMapper;

    public MovementService(JsonMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public List<Movement> getMovements(LocalDate from, LocalDate to, String type){

        try {
            ClassPathResource resource = new ClassPathResource("data/movements.json");

            List<Movement> movements;

            try (InputStream inputStream = resource.getInputStream()) {
                movements = objectMapper.readValue(inputStream, new TypeReference<List<Movement>>() {
                });
            }

            Instant fromInstant = from
                    .atStartOfDay()
                    .toInstant(ZoneOffset.UTC);

            Instant toInstant = to
                    .plusDays(1)
                    .atStartOfDay()
                    .toInstant(ZoneOffset.UTC);

            return movements.stream()
                    .filter(movement -> {
                        Instant timestamp =
                                Instant.parse(movement.getTimestamp());
                        return !timestamp.isBefore(fromInstant)
                                && timestamp.isBefore(toInstant);
                    })
                    .filter(movement ->
                            type == null
                                    || type.equalsIgnoreCase("ALL")
                                    || movement.getMovementType()
                                    .equalsIgnoreCase(type)
                    )
                    .toList();
        } catch (IOException e) {
            throw new RuntimeException("Error reading movements.json file", e);
        }
    }
}