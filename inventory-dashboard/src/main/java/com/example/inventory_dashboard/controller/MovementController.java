package com.example.inventory_dashboard.controller;

import com.example.inventory_dashboard.model.Movement;
import com.example.inventory_dashboard.service.MovementService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/movements")
@CrossOrigin(origins = "http://localhost:5173")
public class MovementController {

    private final MovementService movementService;

    public MovementController(MovementService movementService) {
        this.movementService = movementService;
    }

    @GetMapping
    public List<Movement> getMovements(
            @RequestParam LocalDate from,
            @RequestParam LocalDate to,
            @RequestParam(required = false) String type) {

        return movementService.getMovements(from, to, type);
    }
}
