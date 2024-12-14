// LoginRequest.java
package org.schoolmela.quiz.dto;


public class LoginRequest {
    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getPin() {
        return pin;
    }

    public void setPin(String pin) {
        this.pin = pin;
    }

    private String mobile;
    private String pin;
}