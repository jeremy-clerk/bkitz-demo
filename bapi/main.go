package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/clerk/clerk-sdk-go/v2"
	clerkhttp "github.com/clerk/clerk-sdk-go/v2/http"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {

	err := godotenv.Load()

	if err != nil {
		fmt.Printf("%s", "Failed to load .env file")
	}

	clerk.SetKey(os.Getenv("CLERK_SECRET_KEY"))

	r := mux.NewRouter()

	r.HandleFunc("/", publicRoute).Methods("GET")

	protectedPostHandler := http.HandlerFunc(protectedRoute)

	r.Handle("/protected", clerkhttp.WithHeaderAuthorization()(protectedPostHandler)).Methods("POST")

	corsMiddleware := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"}),
		handlers.AllowCredentials(),
	)

	fmt.Println("Server is running on port 8080")
	http.ListenAndServe(":8080", corsMiddleware(r))
}

func publicRoute(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte(`{"message": "ok"}`))
}

func protectedRoute(w http.ResponseWriter, r *http.Request) {
	claims, ok := clerk.SessionClaimsFromContext(r.Context())
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"access": "unauthorized"}`))
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(claims)
}
