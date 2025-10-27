# 📊 Projet Students Performance
# Étude des performances des étudiants aux examens
# Nom : Mohamed Aziz Khmiri
# Filière : Big Data & Analyse de données
# Matière : Analyse et Fouille de Données
# Date : [Date de remise]

# =============================
# Importation des outils
# =============================
library(tidyverse)   # Pour manipulation et visualisation des données
library(ggplot2)     # Pour les graphiques

# =============================
# Importation de dataset
# =============================
df <- read.csv("C:\Users\medaz\OneDrive\Documents\Aziz_Media\ESCT\S2\Machine Learning\ProjetStudentsPerformance_StudentsPerformance.csv")
str(df)
head(df)

# =============================
# Paramètres statistiques usuels
# =============================
# Taille de la base de données
dim(df)

# Vérifier s'il existe des données en double
sum(duplicated(df))

# Voir la somme des valeurs nulles
colSums(is.na(df))

# Voir le nombre de valeurs égales à 0 par colonne
colSums(df == 0, na.rm = TRUE)

# Statistiques descriptives sur 'math score'
mean(df$math.score, na.rm = TRUE)      # Moyenne
median(df$math.score, na.rm = TRUE)    # Médiane
min(df$math.score, na.rm = TRUE)       # Minimum
max(df$math.score, na.rm = TRUE)       # Maximum
prop.table(table(df$math.score))       # Distribution de fréquence (proportion)
var(df$math.score, na.rm = TRUE)       # Variance
sd(df$math.score, na.rm = TRUE)        # Ecart-type

# =============================
# Statistiques descriptives globales
# =============================
summary(df)

# IQR de la variable 'math score'
IQR(df$math.score, na.rm = TRUE)

# =============================
# Graphiques basiques pour décrire une variable
# =============================
# Histogramme du math score
ggplot(df, aes(x = math.score)) +
  geom_histogram(binwidth = 5, fill = "skyblue", color = "black") +
  labs(title = "Histogramme du score de mathématiques", x = "Score de math", y = "Fréquence")

# Densité de probabilité du reading score
ggplot(df, aes(x = reading.score)) +
  geom_density(fill = "lightgreen") +
  labs(title = "Densité de probabilité du score de lecture", x = "Score de lecture", y = "Densité")

# =============================
# Détection des outliers
# =============================
finding_outliers <- function(data, variable_name) {
  iqr <- IQR(data[[variable_name]], na.rm = TRUE)
  lower <- quantile(data[[variable_name]], 0.25, na.rm = TRUE) - 1.5 * iqr
  upper <- quantile(data[[variable_name]], 0.75, na.rm = TRUE) + 1.5 * iqr
  data[data[[variable_name]] < lower | data[[variable_name]] > upper, ]
}

# Points de données aberrants de la variable writing score
finding_outliers(df, "writing.score")

# =============================
# Boîte à moustache du math score
# =============================
ggplot(df, aes(y = math.score)) +
  geom_boxplot(fill = "orange") +
  labs(title = "Boîte à moustache du score de mathématiques", y = "Score de math")