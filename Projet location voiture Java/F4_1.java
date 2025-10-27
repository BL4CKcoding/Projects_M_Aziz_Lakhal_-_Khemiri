import java.awt.*;
import javax.swing.*;
import java.awt.event.*;
import java.sql.*;

public class F4_1 extends JFrame implements ActionListener {
    JButton liste = new JButton("Voir Liste des Voitures");
    JButton sett = new JButton("Mes Paramètres d'Accès");
    JLabel userLabel = new JLabel();
    public int id_user;
    Connection connection;
    public F4_1(int id_user) {
        super("Interface de l'utilisateur");
        this.id_user = id_user;
        setSize(800, 800);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setLocationRelativeTo(null);
        JPanel p4_1 = new JPanel();
        p4_1.setLayout(new BorderLayout());
        p4_1.setBackground(new Color(0, 57, 99));
        JLabel titre = new JLabel("Menu Principal", SwingConstants.CENTER);
        titre.setFont(new Font("Arial", Font.BOLD, 22));
        titre.setForeground(new Color(229, 229, 229));
        titre.setBorder(BorderFactory.createEmptyBorder(20, 10, 20, 10));
        p4_1.add(titre, BorderLayout.NORTH);
        JPanel centre = new JPanel();
        centre.setLayout(new GridBagLayout());
        centre.setOpaque(false);
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(15, 20, 15, 20);
        userLabel.setText("Votre ID : " + id_user);
        userLabel.setFont(new Font("Arial", Font.PLAIN, 16));
        userLabel.setForeground(new Color(229, 229, 229));
        Color couleurb = new Color(0, 142, 197);
        bouton(liste, couleurb, Color.WHITE);
        bouton(sett, couleurb, Color.WHITE);
        gbc.gridx = 0;
        gbc.gridy = 0;
        centre.add(userLabel, gbc);
        gbc.gridx = 0;
        gbc.gridy = 1;
        centre.add(liste, gbc);
        gbc.gridx = 0;
        gbc.gridy = 2;
        centre.add(sett, gbc);
        p4_1.add(centre, BorderLayout.CENTER);
        JPanel footerPanel = new JPanel(new BorderLayout());
        footerPanel.setBackground(new Color(0, 57, 99));
        JLabel footer = new JLabel("\u00a9 2025 - A.Lakhal - A.Khmiri - F.Aissaoui - R.Khlif", SwingConstants.CENTER);
        footer.setFont(new Font("Arial", Font.ITALIC, 12));
        footer.setForeground(new Color(252, 208, 55));
        footer.setBorder(BorderFactory.createEmptyBorder(10, 0, 10, 0));
        footerPanel.add(footer, BorderLayout.CENTER);
        p4_1.add(footerPanel, BorderLayout.SOUTH);
        setContentPane(p4_1);
        liste.addActionListener(this);
        sett.addActionListener(this);
    }
    public void actionPerformed(ActionEvent e4_1) {
        if (e4_1.getSource() == liste) {
            F5 f5 = new F5(id_user);
            f5.setVisible(true);
        }
        if (e4_1.getSource() == sett) {
            F6 f6 = new F6(id_user);
            f6.setVisible(true);
        }
    }
    private void bouton(JButton bouton, Color bgColor, Color fgColor) {
        bouton.setFont(new Font("Arial", Font.BOLD, 14));
        bouton.setBackground(bgColor);
        bouton.setForeground(fgColor);
        bouton.setFocusPainted(false);
        bouton.setBorder(BorderFactory.createLineBorder(new Color(0, 57, 99)));
        bouton.setPreferredSize(new Dimension(300, 40));
    }
}