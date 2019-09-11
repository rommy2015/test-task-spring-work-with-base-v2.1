package com.task.test.users.web.rest.api;

import com.task.test.users.security.service.RequestOwnerService;
import com.task.test.users.service.dto.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("api/users")
public class RequestOwnerRestController {

    private RequestOwnerService requestOwnerService;

    @Autowired
    public RequestOwnerRestController(RequestOwnerService requestOwnerService) {
        this.requestOwnerService = requestOwnerService;
    }

    @GetMapping("owner")
    public ResponseEntity<UserDto> getRequestOwner() {


        UserDto dataRequestOwner = requestOwnerService.getDataRequestOwner();

        return ResponseEntity.ok(dataRequestOwner);

    }
}
