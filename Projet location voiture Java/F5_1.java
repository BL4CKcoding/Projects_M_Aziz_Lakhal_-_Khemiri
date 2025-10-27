import java.awt.*;
import javax.swing.*;
import java.awt.event.*;
import java.sql.*;

public class F5_1 extends JFrame implements ActionListener {
    JLabel l1 = new JLabel("Saisissez la marque");
    JTextField t1 = new JTextField(20);
    JLabel l2 = new JLabel("Saisissez le modèle");
    JTextField t2 = new JTextField(20);
    JLabel l3 = new JLabel("Saisissez l'âge");
    JTextField t3 = new JTextField(10);
    JLabel l4 = new JLabel("Saisissez le prix");
    JTextField t4 = new JTextField(20);
    JButton create = new JButton("Ajouter");
    Connection connection;
    public F5_1() {
        super("Interface d'ajout de voiture");
        setSize(800, 800);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setLocationRelativeTo(null);
        try {
            connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/location_voitures", "root", "");
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(this, "Erreur de connexion à la base de données : " + e.getMessage(), "Erreur", JOptionPane.ERROR_MESSAGE);
            return;
        }
        JPanel p5_1 = new JPanel();
        p5_1.setLayout(new BorderLayout());
        p5_1.setBackground(new Color(0, 57, 99));
        JLabel titre = new JLabel("Ajout de Voiture", SwingConstants.CENTER);
        titre.setFont(new Font("Arial", Font.BOLD, 22));
        titre.setForeground(new Color(229, 229, 229));
        titre.setBorder(BorderFactory.createEmptyBorder(20, 10, 20, 10));
        p5_1.add(titre, BorderLayout.NORTH);
        JPanel centre = new JPanel(new GridBagLayout());
        centre.setOpaque(false);
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(10, 20, 10, 20);
        styleChamp(l1, t1);
        styleChamp(l2, t2);
        styleChamp(l3, t3);
        styleChamp(l4, t4);
        gbc.gridx = 0;
        gbc.gridy = 0;
        centre.add(l1, gbc);
        gbc.gridx = 1;
        centre.add(t1, gbc);
        gbc.gridx = 0;
        gbc.gridy = 1;
        centre.add(l2, gbc);
        gbc.gridx = 1;
        centre.add(t2, gbc);
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
        JPanel bp = new JPanel();
        bp.setOpaque(false);
        Color couleurb = new Color(0, 142, 197);
        bouton(create, couleurb, Color.WHITE);
        bp.add(create);
        gbc.gridx = 0;
        gbc.gridy = 4;
        gbc.gridwidth = 2;
        gbc.anchor = GridBagConstraints.CENTER;
        centre.add(bp, gbc);
        p5_1.add(centre, BorderLayout.CENTER);
        JPanel footerPanel = new JPanel(new BorderLayout());
        footerPanel.setBackground(new Color(0, 57, 99));
        JLabel footer = new JLabel("\u00a9 2025 - A.Lakhal - A.Khmiri - F.Aissaoui - R.Khlif", SwingConstants.CENTER);
        footer.setFont(new Font("Arial", Font.ITALIC, 12));
        footer.setForeground(new Color(252, 208, 55));
        footer.setBorder(BorderFactory.createEmptyBorder(10, 0, 10, 0));
        footerPanel.add(footer, BorderLayout.CENTER);
        p5_1.add(footerPanel, BorderLayout.SOUTH);
        setContentPane(p5_1);
        create.addActionListener(this);
    }
    public void actionPerformed(ActionEvent e5_1) {
        if (e5_1.getSource() == create) {
            String marque = t1.getText();
            String modele = t2.getText();
            String age = t3.getText();
            String prix = t4.getText();
            try {
                String req = "INSERT INTO voitures (Marque, Modele, Age, Prix) VALUES (?, ?, ?, ?)";
                PreparedStatement format = connection.prepareStatement(req);
                format.setString(1, marque);
                format.setString(2, modele);
                format.setString(3, age);
                format.setString(4, prix);
                int exec = format.executeUpdate();
                if (exec > 0) {
                    JOptionPane.showMessageDialog(this, "Voiture ajoutée avec succès !");
                } else {
                    JOptionPane.showMessageDialog(this, "Échec de l'ajout de la voiture.", "Erreur", JOptionPane.ERROR_MESSAGE);
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
    private void bouton(JButton bouton, Color bgColor, Color fgColor) {
        bouton.setFont(new Font("Arial", Font.BOLD, 14));
        bouton.setBackground(bgColor);
        bouton.setForeground(fgColor);
        bouton.setFocusPainted(false);
        bouton.setBorder(BorderFactory.createLineBorder(new Color(0, 57, 99)));
    }
}