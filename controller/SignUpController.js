export class SignUp {
    async saveUser(userDTO) {
        try {
            await $.ajax({
                url: "http://localhost:5050/api/v1/auth/signUp",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(userDTO)
            });
            Swal.fire("Saved!", "", "success");
        } catch (xhr) {
            console.error("Failed to save user:", xhr);
            if (xhr.status === 400) {
                Swal.fire("Error", "Failed to save user: Bad request", "error");
            } else {
                Swal.fire("Error", "Failed to save user: Server error", "error");
            }
        }
    }
}