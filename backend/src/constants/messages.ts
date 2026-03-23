export const MESSAGES = {
    AUTH: {
        REGISTER_SUCCESS: "User registered successfully.",
        LOGIN_SUCCESS: "Login successful.",
        FORGOT_PASSWORD_SUCCESS: "Password reset instructions generated successfully.",
        RESET_PASSWORD_SUCCESS: "Password reset successful.",
        NAME_REQUIRED: "Name is required.",
        INVALID_NAME: "Name must be at least 2 characters long.",
        EMAIL_REQUIRED: "Email is required.",
        INVALID_EMAIL: "Please provide a valid email address.",
        PASSWORD_REQUIRED: "Password is required.",
        PASSWORD_MIN_LENGTH: "Password must be at least 8 characters long.",
        ROLE_REQUIRED: "Role is required.",
        INVALID_ROLE: "Invalid role provided.",
        USER_ALREADY_EXISTS: "User already exists with this email.",
        INVALID_CREDENTIALS: "Invalid email or password.",
        USER_BLOCKED: "This account has been blocked.",
        USER_NOT_FOUND: "User not found.",
        RESET_TOKEN_REQUIRED: "Reset token is required.",
        INVALID_RESET_TOKEN: "Invalid or expired reset token.",
    },

    SERVICE: {
        CREATED_SUCCESS: "Service created successfully.",
        FETCHED_SUCCESS: "Services fetched successfully.",
        DETAILS_FETCHED_SUCCESS: "Service details fetched successfully.",
        UPDATED_SUCCESS: "Service updated successfully.",
        DELETED_SUCCESS: "Service deleted successfully.",
        TITLE_REQUIRED: "Service title is required.",
        DESCRIPTION_REQUIRED: "Service description is required.",
        CATEGORY_REQUIRED: "Service category is required.",
        LOCATION_REQUIRED: "Service location is required.",
        PRICE_REQUIRED: "Price per day is required.",
        INVALID_PRICE: "Price per day must be a valid positive number.",
        INVALID_PRICE_RANGE: "Minimum price cannot be greater than maximum price.",
        PROVIDER_ONLY: "Only providers can manage services.",
        SERVICE_NOT_FOUND: "Service not found.",
        UNAUTHORIZED_ACCESS: "You are not allowed to modify this service.",
    },

    COMMON: {
        ALL_FIELDS_REQUIRES: "All fields are required."
    }
}
