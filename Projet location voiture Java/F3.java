import java.awt.*;
import javax.swing.*;
import java.awt.event.*;
import java.sql.*;

public class F3 extends JFrame implements ActionListener {
    JLabel l1 = new JLabel("Saisissez votre Nom et Prenom");
    JTextField t1 = new JTextField(20);
    JLabel l3 = new JLabel("Saisissez votre mot de passe");
    JPasswordField t3 = new JPasswordField(20);
    JLabel l4 = new JLabel("Saisissez votre Ville");
    JTextField t4 = new JTextField(20);
    JLabel l5 = new JLabel("Saisissez votre Adresse Mail");
    JTextField t5 = new JTextField(20);
    JButton create = new JButton("Créer votre compte");
    Connection connection;
    public F3() {
        super("Interface de Création de Compte");
        setSize(800, 800);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setLocationRelativeTo(null);
        try {
            connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/location_voitures", "root", "");
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(this, "Erreur de connexion à la base de données : " + e.getMessage(), "Erreur", JOptionPane.ERROR_MESSAGE);
            return;
        }
        JPanel p3 = new JPanel();
        p3.setLayout(new BorderLayout());
        p3.setBackground(new Color(0, 57, 99));
        JLabel titre = new JLabel("Création de Compte", SwingConstants.CENTER);
        titre.setFont(new Font("Arial", Font.BOLD, 22));
        titre.setForeground(new Color(229, 229, 229));
        titre.setBorder(BorderFactory.createEmptyBorder(20, 10, 20, 10));
        p3.add(titre, BorderLayout.NORTH);
        JPanel centre = new JPanel(new GridBagLayout());
        centre.setOpaque(false);
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(10, 20, 10, 20);
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
        gbc.gridy = 2;
        centre.add(l3, gbc);
        gbc.gridx = 1;
        centre.add(t3, gbc);
        gbc.gridx = 0;
        gbc.gridy = 3;
        centre.add(l4, gbc);
        gbc.gridx = 1;
        centre.add(t4, gbc);
        gbc.gridx = 0;
        gbc.gridy = 4;
        centre.add(l5, gbc);
        gbc.gridx = 1;
        centre.add(t5, gbc);
        JPanel bp = new JPanel();
        bp.setOpaque(false);
        Color couleurb = new Color(0, 142, 197);
        bouton(create, couleurb, Color.WHITE);
        bp.add(create);
        gbc.gridx = 0;
        gbc.gridy = 5;
        gbc.gridwidth = 2;
        gbc.anchor = GridBagConstraints.CENTER;
        centre.add(bp, gbc);
        p3.add(centre, BorderLayout.CENTER);
        JPanel footerPanel = new JPanel(new BorderLayout());
        footerPanel.setBackground(new Color(0, 57, 99));
        JLabel footer = new JLabel("\u00a9 2025 - A.Lakhal - A.Khmiri - F.Aissaoui - R.Khlif", SwingConstants.CENTER);
        footer.setFont(new Font("Arial", Font.ITALIC, 12));
        footer.setForeground(new Color(252, 208, 55));
        footer.setBorder(BorderFactory.createEmptyBorder(10, 0, 10, 0));
        footerPanel.add(footer, BorderLayout.CENTER);
        p3.add(footerPanel, BorderLayout.SOUTH);
        setContentPane(p3);
        create.addActionListener(this);
    }
    public void actionPerformed(ActionEvent e3) {
        if (e3.getSource() == create) {
            String np = t1.getText();
            String mdp = new String(t3.getPassword());
            String ville = t4.getText();
            String mail = t5.getText();
            try {
                String req = "INSERT INTO personnes(Nom_et_prenom, Mot_de_Passe, Adresse, Mail) VALUES(?, ?, ?, ?)";
                PreparedStatement format = connection.prepareStatement(req);
                format.setString(1, np);
                format.setString(2, mdp);
                format.setString(3, ville);
                format.setString(4, mail);
                int exec = format.executeUpdate();
                if (exec > 0) {
                    String req1 = "SELECT * FROM personnes WHERE Mail = ? AND Mot_de_Passe = ?";
                    PreparedStatement format1 = connection.prepareStatement(req1);
                    format1.setString(1, mail);
                    format1.setString(2, mdp);
                    ResultSet exec1 = format1.executeQuery();
                    if (exec1.next()) {
                        int id_user = exec1.getInt("ID");
                        System.out.println("User ID: " + id_user);
                        F4_1 f4_1 = new F4_1(id_user);
                        f4_1.setVisible(true);
                    } else {
                        JOptionPane.showMessageDialog(this, "Utilisateur non trouvé après création.");
                    }
                    exec1.close();
                    format1.close();
                } else {
                    JOptionPane.showMessageDialog(this, "Mail déjà existant");
                }
                format.close();
            } catch (SQLException e) {
                JOptionPane.showMessageDialog(this, "Erreur SQL : " + e.getMessage(), "Erreur", JOptionPane.ERROR_MESSAGE);
            }
        }
    }
    private void styleChamp(JLabel label, JTextField textField) {
        label.setFont(new Font("Arial", Font.PLAIN, 16));
        label.setForeground(new Color(229, 229, 229));
        textField.setFont(new Font("Arial", Font.PLAIN, 14));
        textField.setBackground(Color.WHITE);
        textField.setForeground(Color.BLACK);
    }
    private void styleChamp(JLabel label, JPasswordField passwordField) {
        label.setFont(new Font("Arial", Font.PLAIN, 16));
        label.setForeground(new Color(229, 229, 229));
        passwordField.setFont(new Font("Arial", Font.PLAIN, 14));
        passwordField.setBackground(Color.WHITE);
        passwordField.setForeground(Color.BLACK);
    }
    private void bouton(JButton bouton, Color bgColor, Color fgColor) {
        bouton.setFont(new Font("Arial", Font.BOLD, 14));
        bouton.setBackground(bgColor);
        bouton.setForeground(fgColor);
        bouton.setFocusPainted(false);
        bouton.setBorder(BorderFactory.createLineBorder(new Color(0, 57, 99)));
    }
}