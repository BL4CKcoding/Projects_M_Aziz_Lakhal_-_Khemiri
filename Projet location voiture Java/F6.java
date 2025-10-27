import java.awt.*;
import javax.swing.*;
import java.awt.event.*;
import java.sql.*;

public class F6 extends JFrame {
    JLabel l1 = new JLabel("Votre Nom et Prénom");
    JLabel l3 = new JLabel("Votre mot de passe");
    JLabel l4 = new JLabel("Votre Ville");
    JLabel l5 = new JLabel("Votre Adresse Mail");
    JTextField t1;
    JTextField t3;
    JTextField t4;
    JTextField t5;
    JButton modifier = new JButton("Modifier");
    Connection connection;
    public int id_user;

    public F6(int id_user) {
        super("Interface de Modification de Compte");
        this.id_user = id_user;
        setSize(800, 800);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setLocationRelativeTo(null);
        try {
            connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/location_voitures", "root", "");
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(this, "Erreur de connexion à la base de données : " + e.getMessage(), "Erreur", JOptionPane.ERROR_MESSAGE);
            return;
        }
        JPanel p6 = new JPanel();
        p6.setLayout(new BorderLayout());
        p6.setBackground(new Color(0, 57, 99));
        JLabel titre = new JLabel("Modification de Compte", SwingConstants.CENTER);
        titre.setFont(new Font("Arial", Font.BOLD, 22));
        titre.setForeground(new Color(229, 229, 229));
        titre.setBorder(BorderFactory.createEmptyBorder(20, 10, 20, 10));
        p6.add(titre, BorderLayout.NORTH);
        JPanel centre = new JPanel(new GridBagLayout());
        centre.setOpaque(false);
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(10, 20, 10, 20);
        try {
            String req = "SELECT * FROM personnes WHERE ID = ?";
            PreparedStatement format = connection.prepareStatement(req);
            format.setInt(1, id_user);
            ResultSet exec = format.executeQuery();
            if (exec.next()) {
                t1 = new JTextField(exec.getString("Nom_et_prenom"), 20);
                t3 = new JTextField(exec.getString("Mot_de_Passe"), 10);
                t4 = new JTextField(exec.getString("Adresse"), 20);
                t5 = new JTextField(exec.getString("Mail"), 20);
            } else {
                JOptionPane.showMessageDialog(this, "Données utilisateur introuvables.", "Erreur", JOptionPane.ERROR_MESSAGE);
                t1 = new JTextField(20);
                t3 = new JTextField(10);
                t4 = new JTextField(20);
                t5 = new JTextField(20);
            }
            format.close();
            exec.close();
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(this, "Erreur lors de la récupération des données : " + e.getMessage(), "Erreur", JOptionPane.ERROR_MESSAGE);
            t1 = new JTextField(20);
            t3 = new JTextField(10);
            t4 = new JTextField(20);
            t5 = new JTextField(20);
        }
        styleChamp(l1, t1);
        styleChamp(l3, t3);
        styleChamp(l4, t4);
        styleChamp(l5, t5);
        gbc.gridx = 0;
        gbc.gridy = 0;
        centre.add(l1, gbc);
        gbc.gridx = 1;
        centre.add(t1, gbc);
        gbc.gridx = 0;
        gbc.gridy = 1;
        centre.add(l3, gbc);
        gbc.gridx = 1;
        centre.add(t3, gbc);
        gbc.gridx = 0;
        gbc.gridy = 2;
        centre.add(l4, gbc);
        gbc.gridx = 1;
        centre.add(t4, gbc);
        gbc.gridx = 0;
        gbc.gridy = 3;
        centre.add(l5, gbc);
        gbc.gridx = 1;
        centre.add(t5, gbc);
        JPanel bp = new JPanel();
        bp.setOpaque(false);
        Color couleurb = new Color(0, 142, 197);
        bouton(modifier, couleurb, Color.WHITE);
        bp.add(modifier);
        gbc.gridx = 0;
        gbc.gridy = 4;
        gbc.gridwidth = 2;
        gbc.anchor = GridBagConstraints.CENTER;
        centre.add(bp, gbc);
        p6.add(centre, BorderLayout.CENTER);
        JPanel footerPanel = new JPanel(new BorderLayout());
        footerPanel.setBackground(new Color(0, 57, 99));
        JLabel footer = new JLabel("\u00a9 2025 - A.Lakhal - A.Khmiri - F.Aissaoui - R.Khlif", SwingConstants.CENTER);
        footer.setFont(new Font("Arial", Font.ITALIC, 12));
        footer.setForeground(new Color(252, 208, 55));
        footer.setBorder(BorderFactory.createEmptyBorder(10, 0, 10, 0));
        footerPanel.add(footer, BorderLayout.CENTER);
        p6.add(footerPanel, BorderLayout.SOUTH);
        setContentPane(p6);
        modifier.addActionListener(new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                try {
                    String req1 = "UPDATE personnes SET Nom_et_prenom = ?, Mot_de_Passe = ?, Adresse = ?, Mail = ? WHERE ID = ?";
                    PreparedStatement format1 = connection.prepareStatement(req1);
                    format1.setString(1, t1.getText());
                    format1.setString(2, t3.getText());
                    format1.setString(3, t4.getText());
                    format1.setString(4, t5.getText());
                    format1.setInt(5, id_user);
                    int exec1 = format1.executeUpdate();
                    if (exec1 > 0) {
                        JOptionPane.showMessageDialog(F6.this, "Les données ont été mises à jour avec succès.", "Succès", JOptionPane.INFORMATION_MESSAGE);
                    } else {
                        JOptionPane.showMessageDialog(F6.this, "Aucune modification apportée.", "Information", JOptionPane.WARNING_MESSAGE);
                    }
                    format1.close();
                } catch (SQLException ex1) {
                    JOptionPane.showMessageDialog(F6.this, "Erreur SQL : " + ex1.getMessage(), "Erreur", JOptionPane.ERROR_MESSAGE);
                }
            }
        });
    }
    private void styleChamp(JLabel label, JTextField textField) {
        label.setFont(new Font("Arial", Font.PLAIN, 16));
        label.setForeground(new Color(229, 229, 229));
        textField.setFont(new Font("Arial", Font.PLAIN, 14));
        textField.setBackground(Color.WHITE);
        textField.setForeground(Color.BLACK);
    }
    private void bouton(JButton bouton, Color bgColor, Color fgColor) {
        bouton.setFont(new Font("Arial", Font.BOLD, 14));
        bouton.setBackground(bgColor);
        bouton.setForeground(fgColor);
        bouton.setFocusPainted(false);
        bouton.setBorder(BorderFactory.createLineBorder(new Color(0, 57, 99)));
    }
}
