#!/bin/bash

# Function to ask for input and append to .env
add_to_env() {
  local key="$1"
  local prompt="$2"
  read -p "$prompt: " value
  echo "$key=\"$value\"" >> .env
}

# Function to generate a random encryption key (32 bytes) and IV (12 bytes)
generate_key_and_iv() {
  local key iv
  key=$(openssl rand -hex 32)  # Generate 32-byte hex string
  iv=$(openssl rand -hex 16)   # Generate 16-byte hex string
  echo "Generated Encryption Key: $key"
  echo "Generated Encryption IV: $iv"
  echo "ENCRYPTION_KEY=$key" >> .env
  echo "ENCRYPTION_IV=$iv" >> .env
}


# Interactive inputs
echo "Adding environment variables to .env file..."

add_to_env "ADMIN_USERNAME" "Enter Admin Username"
add_to_env "ADMIN_PASSWORD" "Enter Admin Password"
add_to_env "ADMIN_EMAIL" "Enter Admin Email"
add_to_env "PORT" "Enter Port"

add_to_env "JWT_SECURITY_KEY" "Enter JWT Security Key"
add_to_env "JWT_EXPIRATION" "Enter JWT Expiration (e.g., 1d, 2h)"

# Ask user if they want to generate the key and IV
read -p "Do you want to generate Encryption Key and IV automatically? (y/n): " generate
if [[ "$generate" == "y" || "$generate" == "Y" ]]; then
  generate_key_and_iv
else
  add_to_env "ENCRYPTION_KEY" "Enter Encryption Key (32-byte)"
  add_to_env "ENCRYPTION_IV" "Enter Encryption IV (12-byte)"
fi

echo ".env file updated successfully!"

# migrate database
# Run the Prisma seed command
read -p "Do you want to run 'migrate database'? (y/n): " run_migration
if [[ "$run_migration" == "y" || "$run_migration" == "Y" ]]; then
  npx npx prisma migrate dev --name init
  if [[ $? -eq 0 ]]; then
    echo "Database seeding completed successfully!"
  else
    echo "Database seeding failed. Please check your configuration."
  fi
else
  echo "Skipping database seeding."
fi

# Run the Prisma seed command
read -p "Do you want to run 'npx prisma db seed'? (y/n): " run_seed
if [[ "$run_seed" == "y" || "$run_seed" == "Y" ]]; then
  npx prisma db seed
  if [[ $? -eq 0 ]]; then
    echo "Database seeding completed successfully!"
  else
    echo "Database seeding failed. Please check your configuration."
  fi
else
  echo "Skipping database seeding."
fi
