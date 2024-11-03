package dev.swe573.whatsthis.dto;

import lombok.Data;

@Data
public class TagDto {
    private String id;
    private String label;
    private String description;
    private String wikiUrl;

    public TagDto (String id, String label, String description, String wikiUrl) {
        this.id = id;
        this.label = label;
        this.description = description;
        this.wikiUrl = wikiUrl;
    }

}
