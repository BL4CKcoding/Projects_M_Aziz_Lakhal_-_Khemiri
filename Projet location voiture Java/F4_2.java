import java.awt.*;
import javax.swing.*;
import java.awt.event.*;

public class F4_2 extends JFrame implements ActionListener {
    JButton aj_voit = new JButton("Ajouter une Nouvelle Voiture");
    String[] options = {"Tous", "Dispo", "Marque", "Prix"};
    JComboBox<String> see_voit = new JComboBox<>(options);
    JButton see_user = new JButton("Consulter la Liste des Utilisateurs");
    public F4_2() {
        super("Interface de sélection admin");
        setSize(800, 800);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setLocationRelativeTo(null);
        JPanel p4_2 = new JPanel();
        p4_2.setLayout(new BorderLayout());
        p4_2.setBackground(new Color(0, 57, 99));
        JLabel titre = new JLabel("Menu Administrateur", SwingConstants.CENTER);
        titre.setFont(new Font("Arial", Font.BOLD, 22));
        titre.setForeground(new Color(229, 229, 229));
        titre.setBorder(BorderFactory.createEmptyBorder(20, 10, 20, 10));
        p4_2.add(titre, BorderLayout.NORTH);
        JPanel centre = new JPanel();
        centre.setLayout(new GridBagLayout());
        centre.setOpaque(false);
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(15, 20, 15, 20);
        Color couleurb = new Color(0, 142, 197);
        bouton(aj_voit, couleurb, Color.WHITE);
        bouton(see_user, couleurb, Color.WHITE);
        see_voit.setFont(new Font("Arial", Font.BOLD, 14));
        see_voit.setForeground(Color.WHITE);
        see_voit.setBackground(couleurb);
        see_voit.setPreferredSize(new Dimension(300, 40));
        JLabel filterLabel = new JLabel("Afficher la liste des voitures triée selon : ");
        filterLabel.setFont(new Font("Arial", Font.PLAIN, 14));
        filterLabel.setForeground(Color.WHITE);
        gbc.gridx = 0;
        gbc.gridy = 0;
        centre.add(aj_voit, gbc);
        gbc.gridx = 0;
        gbc.gridy = 1;
        centre.add(filterLabel, gbc);
        gbc.gridx = 0;
        gbc.gridy = 2;
        centre.add(see_voit, gbc);
        gbc.gridx = 0;
        gbc.gridy = 3;
        centre.add(see_user, gbc);
        p4_2.add(centre, BorderLayout.CENTER);
        JPanel footerPanel = new JPanel(new BorderLayout());
        footerPanel.setBackground(new Color(0, 57, 99));
        JLabel footer = new JLabel("\u00a9 2025 - A.Lakhal - A.Khmiri - F.Aissaoui - R.Khlif", SwingConstants.CENTER);
        footer.setFont(new Font("Arial", Font.ITALIC, 12));
        footer.setForeground(new Color(252, 208, 55));
        footer.setBorder(BorderFactory.createEmptyBorder(10, 0, 10, 0));
        footerPanel.add(footer, BorderLayout.CENTER);
        p4_2.add(footerPanel, BorderLayout.SOUTH);
        setContentPane(p4_2);
        aj_voit.addActionListener(this);
        see_voit.addActionListener(this);
        see_user.addActionListener(this);
    }
    public void actionPerformed(ActionEvent e4_2) {
        if (e4_2.getSource() == aj_voit) {
            F5_1 f5_1 = new F5_1();
            f5_1.setVisible(true);
        }
        if (e4_2.getSource() == see_user) {
            F5_3 f5_3 = new F5_3();
            f5_3.setVisible(true);
        }
        if (e4_2.getSource() == see_voit) {
            String selectedOption = (String) see_voit.getSelectedItem();
            F5_2 f5_2 = new F5_2(selectedOption);
            f5_2.setVisible(true);
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