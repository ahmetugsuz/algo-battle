ALGORITME = "Tesla"

ENEMIES_PLAYED = ["Alan", "Tesla", "Alan"]


for i in range(0, len(ENEMIES_PLAYED)-1):
    if ENEMIES_PLAYED[i] == ALGORITME:
        if ALGORITME == "Tesla":
            if "Alan" not in ENEMIES_PLAYED:
                ALGORITME = "Alan"
            elif "Kidy" not in ENEMIES_PLAYED:
                ALGORITME = "Kidy" 
        elif ALGORITME == "Alan":
            if "Kidy" not in ENEMIES_PLAYED:
                ALGORITME = "Kidy"
            elif "Tesla" not in ENEMIES_PLAYED:
                ALGORITME = "Tesla"
        elif ALGORITME == "Kidy":
            if "Tesla" not in ENEMIES_PLAYED:
                ALGORITME = "Tesla"
            elif "Alan" not in ENEMIES_PLAYED:
                ALGORITME = "Alan"
        ENEMIES_PLAYED.remove(ENEMIES_PLAYED[-1])
        ENEMIES_PLAYED.append(ALGORITME)

print("Vi spiller mot algoritmen: ", ALGORITME)
print("ENEMIES PLAYED: ", ENEMIES_PLAYED)
