import javax.swing.table.*;
import java.awt.*;
import javax.swing.*;
import java.awt.event.*;
import java.sql.*; // Required for SQL operations

public class F5 extends JFrame implements ActionListener {
    JLabel l1 = new JLabel("Saisir la référence de la voiture à louer");
    JTextField t1 = new JTextField(20);
    JButton louer = new JButton("Louer");
    JTable tableVoitures;
    DefaultTableModel tableModel;
    Connection connection;
    public int id_user;
    public F5(int id_user) {
        super("Interface de location de voitures");
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
        JPanel p5 = new JPanel();
        p5.setLayout(new BorderLayout());
        p5.setBackground(new Color(0, 57, 99));
        JLabel titre = new JLabel("Location de Voiture", SwingConstants.CENTER);
        titre.setFont(new Font("Arial", Font.BOLD, 22));
        titre.setForeground(new Color(229, 229, 229));
        titre.setBorder(BorderFactory.createEmptyBorder(20, 10, 20, 10));
        p5.add(titre, BorderLayout.NORTH);
        JPanel centre = new JPanel();
        centre.setLayout(new GridBagLayout());
        centre.setOpaque(false);
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(15, 20, 15, 20);
        l1.setFont(new Font("Arial", Font.PLAIN, 16));
        l1.setForeground(new Color(229, 229, 229));
        t1.setFont(new Font("Arial", Font.PLAIN, 14));
        t1.setBackground(Color.WHITE);
        t1.setForeground(Color.BLACK);
        Color couleurb = new Color(0, 142, 197);
        bouton(louer, couleurb, Color.WHITE);
        tableModel = new DefaultTableModel(new String[]{"Réf", "Marque", "Modèle", "Prix"}, 0);
        tableVoitures = new JTable(tableModel);
        styliserTableau(tableVoitures);
        JScrollPane scrollPane = new JScrollPane(tableVoitures);
        scrollPane.setPreferredSize(new Dimension(600, 200));
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.gridwidth = 2;
        centre.add(scrollPane, gbc);
        gbc.gridx = 0;
        gbc.gridy = 1;
        gbc.gridwidth = 1;
        centre.add(l1, gbc);
        gbc.gridx = 1;
        gbc.gridy = 1;
        centre.add(t1, gbc);
        gbc.gridx = 1;
        gbc.gridy = 2;
        centre.add(louer, gbc);
        p5.add(centre, BorderLayout.CENTER);
        JPanel footerPanel = new JPanel(new BorderLayout());
        footerPanel.setBackground(new Color(0, 57, 99));
        JLabel footer = new JLabel("\u00a9 2025 - A.Lakhal - A.Khmiri - F.Aissaoui - R.Khelif", SwingConstants.CENTER);
        footer.setFont(new Font("Arial", Font.ITALIC, 12));
        footer.setForeground(new Color(252, 208, 55));
        footer.setBorder(BorderFactory.createEmptyBorder(10, 0, 10, 0));
        footerPanel.add(footer, BorderLayout.CENTER);
        p5.add(footerPanel, BorderLayout.SOUTH);
        setContentPane(p5);
        louer.addActionListener(this);
        afficherVoituresDisponibles();
    }
    public void afficherVoituresDisponibles() {
        try {
            String query = "SELECT Ref, Marque, Modele, Prix FROM voitures WHERE Dispo = 1";
            PreparedStatement ps = connection.prepareStatement(query);
            ResultSet rs = ps.executeQuery();
            tableModel.setRowCount(0);
            while (rs.next()) {
                int ref = rs.getInt("Ref");
                String marque = rs.getString("Marque");
                String modele = rs.getString("Modele");
                float prix = rs.getFloat("Prix");
                tableModel.addRow(new Object[]{ref, marque, modele, prix});
            }
            rs.close();
            ps.close();
        } catch (SQLException ex) {
            JOptionPane.showMessageDialog(this, "Erreur SQL : " + ex.getMessage(), "Erreur", JOptionPane.ERROR_MESSAGE);
        }
    }
    public void actionPerformed(ActionEvent e5) {
        if (e5.getSource() == louer) {
            String reference = t1.getText();
            if (reference.isEmpty()) {
                JOptionPane.showMessageDialog(this, "Veuillez saisir une référence valide.", "Erreur", JOptionPane.WARNING_MESSAGE);
                return;
            }
            try {
                String dispo = "SELECT * FROM voitures WHERE Ref = ? AND Dispo = 1";
                PreparedStatement ps = connection.prepareStatement(dispo);
                ps.setString(1, reference);
                ResultSet rs = ps.executeQuery();
                if (rs.next()) {
                    String louervoit = "UPDATE voitures SET Dispo = 0, ID_locataire = ? WHERE Ref = ?";
                    PreparedStatement ps2 = connection.prepareStatement(louervoit);
                    ps2.setInt(1, id_user);
                    ps2.setString(2, reference);
                    int rs2 = ps2.executeUpdate();
                    if (rs2 > 0) {
                        JOptionPane.showMessageDialog(this, "Voiture louée avec succès !", "Succès", JOptionPane.INFORMATION_MESSAGE);
                        afficherVoituresDisponibles(); // Rafraîchir le tableau
                    } else {
                        JOptionPane.showMessageDialog(this, "Échec de la location.", "Erreur", JOptionPane.ERROR_MESSAGE);
                    }
                    ps2.close();
                } else {
                    JOptionPane.showMessageDialog(this, "La voiture n'est pas disponible ou la référence est incorrecte.", "Erreur", JOptionPane.WARNING_MESSAGE);
                }
                rs.close();
                ps.close();
            } catch (SQLException ex) {
                JOptionPane.showMessageDialog(this, "Erreur SQL : " + ex.getMessage(), "Erreur", JOptionPane.ERROR_MESSAGE);
            }
        }
    }
    private void bouton(JButton bouton, Color bgColor, Color fgColor) {
        bouton.setFont(new Font("Arial", Font.BOLD, 14));
        bouton.setBackground(bgColor);
        bouton.setForeground(fgColor);
        bouton.setFocusPainted(false);
        bouton.setBorder(BorderFactory.createLineBorder(new Color(0, 57, 99)));
        bouton.setPreferredSize(new Dimension(200, 40));
    }
    private void styliserTableau(JTable table) {
        table.setFont(new Font("Arial", Font.PLAIN, 14));
        table.setRowHeight(25);
        table.setBackground(new Color(229, 229, 229));
        table.setForeground(new Color(0, 57, 99));
        table.setSelectionBackground(new Color(0, 142, 197));
        table.setSelectionForeground(Color.WHITE);
        table.setGridColor(new Color(252, 208, 55));
        JTableHeader header = table.getTableHeader();
        header.setFont(new Font("Arial", Font.BOLD, 16));
        header.setBackground(new Color(0, 57, 99));
        header.setForeground(new Color(252, 208, 55));
        header.setReorderingAllowed(false);
    }
}