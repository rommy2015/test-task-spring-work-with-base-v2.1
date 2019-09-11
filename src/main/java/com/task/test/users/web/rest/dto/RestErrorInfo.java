package com.task.test.users.web.rest.dto;

public class RestErrorInfo {

	private Integer errorCode;

	private String errorMessage;

	public RestErrorInfo() {
	}

	public RestErrorInfo(String errorMessage) {
		this.errorMessage = errorMessage;
	}

	public RestErrorInfo(Integer errorCode, String errorMessage) {
		super();
		this.errorCode = errorCode;
		this.errorMessage = errorMessage;
	}

	public Integer getErrorCode() {
		return errorCode;
	}

	public String getErrorMessage() {
		return errorMessage;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((errorMessage == null) ? 0 : errorMessage.hashCode());

		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}

		if (obj == null) {
			return false;
		}

		if (getClass() != obj.getClass()) {
			return false;
		}

		RestErrorInfo other = (RestErrorInfo) obj;
		if (errorMessage == null) {
			if (other.errorMessage != null) {
				return false;
			}
		} else if (!errorMessage.equals(other.errorMessage)) {
			return false;
		}

		return true;
	}

	@Override
	public String toString() {
		return "RestErrorInfo [errorMessage=" + errorMessage + "]";
	}
}
