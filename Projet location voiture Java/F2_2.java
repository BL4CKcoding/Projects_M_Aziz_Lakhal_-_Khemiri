import java.awt.*;
import javax.swing.*;
import java.awt.event.*;
import java.sql.*;

public class F2_2 extends JFrame implements ActionListener {
    JLabel l1 = new JLabel("Login");
    JTextField t1 = new JTextField(20);
    JLabel l2 = new JLabel("Mot de passe");
    JPasswordField t2 = new JPasswordField(20);
    JButton in = new JButton("Se connecter");
    Connection connection;
    public F2_2() {
        super("Interface d'Identification de l'Admin");
        setSize(800, 800);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setLocationRelativeTo(null);
        try {
            connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/location_voitures", "root", "");
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(this, "Erreur de connexion à la base de données : " + e.getMessage(), "Erreur", JOptionPane.ERROR_MESSAGE);
            return;
        }
        JPanel p2 = new JPanel();
        p2.setLayout(new BorderLayout());
        p2.setBackground(new Color(0, 57, 99));
        JLabel titre = new JLabel("Identification Admin", SwingConstants.CENTER);
        titre.setFont(new Font("Arial", Font.BOLD, 22));
        titre.setForeground(new Color(229, 229, 229));
        titre.setBorder(BorderFactory.createEmptyBorder(20, 10, 20, 10));
        p2.add(titre, BorderLayout.NORTH);
        JPanel centre = new JPanel(new GridBagLayout());
        centre.setOpaque(false);
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(10, 20, 10, 20);
        l1.setFont(new Font("Arial", Font.PLAIN, 16));
        l1.setForeground(new Color(229, 229, 229));
        gbc.gridx = 0;
        gbc.gridy = 0;
        centre.add(l1, gbc);
        t1.setFont(new Font("Arial", Font.PLAIN, 14));
        t1.setBackground(Color.WHITE);
        t1.setForeground(Color.BLACK);
        gbc.gridx = 1;
        gbc.gridy = 0;
        centre.add(t1, gbc);
        l2.setFont(new Font("Arial", Font.PLAIN, 16));
        l2.setForeground(new Color(229, 229, 229));
        gbc.gridx = 0;
        gbc.gridy = 1;
        centre.add(l2, gbc);
        t2.setFont(new Font("Arial", Font.PLAIN, 14));
        t2.setBackground(Color.WHITE);
        t2.setForeground(Color.BLACK);
        gbc.gridx = 1;
        gbc.gridy = 1;
        centre.add(t2, gbc);
        JPanel bp = new JPanel();
        bp.setOpaque(false);
        bp.setLayout(new FlowLayout(FlowLayout.CENTER, 20, 10));
        Color couleurb = new Color(0, 142, 197);
        bouton(in, couleurb, Color.WHITE);
        bp.add(in);
        gbc.gridx = 0;
        gbc.gridy = 2;
        gbc.gridwidth = 2;
        gbc.anchor = GridBagConstraints.CENTER;
        centre.add(bp, gbc);
        p2.add(centre, BorderLayout.CENTER);
        JPanel footerPanel = new JPanel(new BorderLayout());
        footerPanel.setBackground(new Color(0, 57, 99));
        JLabel footer = new JLabel("\u00a9 2025 - A.Lakhal - A.Khmiri - F.Aissaoui - R.Khlif", SwingConstants.CENTER);
        footer.setFont(new Font("Arial", Font.ITALIC, 12));
        footer.setForeground(new Color(252, 208, 55)); // Jaune
        footer.setBorder(BorderFactory.createEmptyBorder(10, 0, 10, 0));
        footerPanel.add(footer, BorderLayout.CENTER);
        p2.add(footerPanel, BorderLayout.SOUTH);
        setContentPane(p2);
        in.addActionListener(this);
    }
    public void actionPerformed(ActionEvent e2) {
        if (e2.getSource() == in) {
            String login_user = t1.getText();
            String mdp_user = new String(t2.getPassword());
            try {
                String req = "SELECT * FROM personnes WHERE Mail = ? AND Mot_de_Passe = ? AND Role = 'Administrateur'";
                PreparedStatement format = connection.prepareStatement(req);
                format.setString(1, login_user);
                format.setString(2, mdp_user);
                ResultSet exec = format.executeQuery();
                if (exec.next()) {
                    F4_2 f4_2 = new F4_2();
                    f4_2.setVisible(true);
                    int id_user = exec.getInt("ID");
                    System.out.println("User ID: " + id_user);
                } else {
                    JOptionPane.showMessageDialog(this, "Coordonnées Invalides");
                }
                exec.close();
                format.close();
            } catch (SQLException e) {
                JOptionPane.showMessageDialog(this, "Erreur SQL : " + e.getMessage(), "Erreur", JOptionPane.ERROR_MESSAGE);
            }
        }
    }
    private void bouton(JButton bouton, Color bgColor, Color fgColor) {
        bouton.setFont(new Font("Arial", Font.BOLD, 14));
        bouton.setBackground(bgColor);
        bouton.setForeground(fgColor);
        bouton.setFocusPainted(false);
        bouton.setBorder(BorderFactory.createLineBorder(new Color(0, 57, 99)));
    }
}