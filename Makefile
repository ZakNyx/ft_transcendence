# Colors
C_RED = \033[1;31m
C_GREEN = \033[1;32m
C_L_BLUE = \033[1;34m
C_RES = \033[0m
C_YELLOW=\033[0;33m
C_PURPLE=\033[0;35m
BRed=\033[1;31m
BGreen=\033[1;32m
BYellow=\033[1;33m
BWhite=\033[1;37m
BPurple=\033[1;35m

all : help

up : 
	@docker-compose up --build -d
	@echo "$(C_GREEN)[PONG's up!]$(C_RES)"

down : 
	@docker compose down
	@echo "$(C_RED)[PONG's down!]$(C_RES)"

img:
	@docker image rm -f frontend backend postgres:13

vol:
	@docker volume prune -af

prune:
	@docker system prune -af
	@echo "$(C_RED)[PRUNED!]$(C_RES)"