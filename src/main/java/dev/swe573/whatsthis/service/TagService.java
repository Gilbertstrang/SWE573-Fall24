package dev.swe573.whatsthis.service;

import dev.swe573.whatsthis.dto.TagDto;
import dev.swe573.whatsthis.model.Wikidata;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;



@Service
public class TagService {

    private final RestTemplate restTemplate;

    @Autowired
    public TagService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<TagDto> searchTags(String query) {

        String url = "https://www.wikidata.org/w/api.php?action=wbsearchentities&search=" + query + "&language=en&format=json";

        ResponseEntity<Wikidata> response =  restTemplate.getForEntity(url, Wikidata.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            return response.getBody().getSearch().stream().map(entity -> new TagDto(
                    entity.getId(),
                    entity.getLabel(),
                    entity.getDescription(),
                    entity.getWikiUrl()
            )).collect(Collectors.toList());
        } else {
            throw new RuntimeException("Could not fetch data from Wikidata :(");
        }


    }
}
