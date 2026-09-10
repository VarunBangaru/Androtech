package com.example.inventory_dashboard.model;

public class Movement {

    private String id;
    private String timestamp;
    private String sku;
    private String movementType;
    private int quantity;

    public Movement() {
    }

    public Movement(
            String id,
            String timestamp,
            String sku,
            String movementType,
            int quantity) {

        this.id = id;
        this.timestamp = timestamp;
        this.sku = sku;
        this.movementType = movementType;
        this.quantity = quantity;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getMovementType() {
        return movementType;
    }

    public void setMovementType(String movementType) {
        this.movementType = movementType;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
